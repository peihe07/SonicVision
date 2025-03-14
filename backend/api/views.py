from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv
import logging
import base64
import requests
import time

# 配置日誌
logger = logging.getLogger(__name__)

load_dotenv()

# 檢查環境變數
client_id = os.getenv('SPOTIFY_CLIENT_ID')
client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')

logger.info(f"SPOTIFY_CLIENT_ID length: {len(client_id) if client_id else 0}")
logger.info(f"SPOTIFY_CLIENT_SECRET length: {len(client_secret) if client_secret else 0}")

# 全局變量
spotify = None
last_init_time = 0
INIT_COOLDOWN = 5  # 冷卻時間（秒）

def initialize_spotify_client():
    """初始化 Spotify 客戶端，包含重試邏輯"""
    global spotify, last_init_time
    
    current_time = time.time()
    if current_time - last_init_time < INIT_COOLDOWN:
        logger.warning("初始化請求過於頻繁，等待冷卻時間")
        return False
        
    last_init_time = current_time
    
    # 詳細檢查憑證
    if not client_id:
        logger.error("缺少 SPOTIFY_CLIENT_ID")
        return False
    if not client_secret:
        logger.error("缺少 SPOTIFY_CLIENT_SECRET")
        return False
        
    logger.info(f"使用憑證 - Client ID: {client_id[:5]}... Secret: {client_secret[:5]}...")
    
    try:
        # 首先驗證憑證
        auth_string = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
        headers = {
            'Authorization': f'Basic {auth_string}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = {'grant_type': 'client_credentials'}
        
        logger.info("正在獲取訪問令牌...")
        response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)
        
        if response.status_code != 200:
            logger.error(f"獲取訪問令牌失敗: {response.status_code} - {response.text}")
            return False
            
        access_token = response.json().get('access_token')
        if not access_token:
            logger.error("響應中沒有訪問令牌")
            return False
            
        logger.info("成功獲取訪問令牌")
        
        # 使用訪問令牌初始化 Spotify 客戶端
        spotify = spotipy.Spotify(
            auth=access_token,
            requests_timeout=10,
            retries=3
        )
        
        # 測試搜索功能
        logger.info("測試 Spotify API 連接...")
        test_results = spotify.search(q='test', limit=1, type='track')
        if not isinstance(test_results, dict) or 'tracks' not in test_results:
            raise Exception("API 響應格式無效")
            
        logger.info("Spotify 客戶端初始化成功")
        return True
        
    except requests.exceptions.RequestException as e:
        logger.error(f"網絡請求錯誤: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"錯誤響應: {e.response.text}")
        spotify = None
        return False
    except Exception as e:
        logger.error(f"Spotify 客戶端初始化失敗: {str(e)}")
        spotify = None
        return False

# 初始化 Spotify 客戶端
initialize_spotify_client()

# ✅ 1. 用戶註冊 API
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({"error": "用戶名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "註冊成功！"}, status=status.HTTP_201_CREATED)


# ✅ 2. 自訂 JWT Token 回應 (添加額外用戶資訊)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username  # 添加用戶名到 JWT Token
        return token


# ✅ 3. 自訂 Token 取得 View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ✅ 4. 用戶資料 API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "date_joined": request.user.date_joined,
    })


# ✅ 5. 用戶列表 API
@api_view(["GET"])
def user_list(request):
    users = User.objects.values("id", "username", "email", "date_joined")
    return Response({"users": list(users)})


# ✅ 6. 測試 API (User Library)
class UserLibraryView(View):
    def get(self, request):
        return JsonResponse({"message": "Hello from UserLibraryView"})


# ✅ 7. 測試受保護 API
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"username": request.user.username})


# Spotify 搜尋 API
@api_view(['GET'])
def spotify_search(request):
    global spotify
    query = request.GET.get('q', '').strip()
    search_type = request.GET.get('type', 'track')
    
    logger.info(f"接收到搜尋請求: query='{query}', type='{search_type}'")
    
    if not query:
        logger.warning("搜尋查詢為空")
        return Response(
            {"error": "搜尋查詢不能為空"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # 檢查並初始化 Spotify 客戶端
    retry_count = 0
    max_retries = 3
    
    while not spotify and retry_count < max_retries:
        logger.info(f"嘗試初始化 Spotify 客戶端 (嘗試 {retry_count + 1}/{max_retries})")
        if initialize_spotify_client():
            break
        retry_count += 1
        if retry_count < max_retries:
            time.sleep(1)
    
    if not spotify:
        error_msg = "無法初始化 Spotify 客戶端"
        logger.error(error_msg)
        return Response(
            {
                "error": error_msg,
                "details": "請確認 Spotify API 憑證是否正確"
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        logger.info(f"執行 Spotify 搜尋: {query}")
        results = spotify.search(q=query, type=search_type, limit=20)
        
        if not isinstance(results, dict):
            error_msg = f"非預期的搜尋結果格式: {type(results)}"
            logger.error(error_msg)
            return Response(
                {"error": "搜尋結果格式錯誤", "details": error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        if 'tracks' not in results:
            error_msg = "搜尋結果中缺少 tracks 字段"
            logger.error(error_msg)
            return Response(
                {"error": "搜尋結果格式錯誤", "details": error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        tracks = results['tracks']['items']
        total_tracks = len(tracks)
        logger.info(f"搜尋成功: 找到 {total_tracks} 首歌曲")
        
        return Response({
            'tracks': {
                'items': tracks,
                'total': total_tracks
            }
        })
        
    except spotipy.exceptions.SpotifyException as e:
        error_msg = f"Spotify API 錯誤: {str(e)}"
        logger.error(error_msg)
        
        if "unauthorized" in str(e).lower():
            logger.info("嘗試重新初始化 Spotify 客戶端")
            if initialize_spotify_client():
                try:
                    results = spotify.search(q=query, type=search_type, limit=20)
                    tracks = results['tracks']['items']
                    return Response({
                        'tracks': {
                            'items': tracks,
                            'total': len(tracks)
                        }
                    })
                except Exception as retry_error:
                    error_msg = f"重試搜尋失敗: {str(retry_error)}"
                    logger.error(error_msg)
                    return Response(
                        {"error": "搜尋失敗", "details": error_msg},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
        
        return Response(
            {"error": "搜尋失敗", "details": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except Exception as e:
        error_msg = f"未預期的錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": "搜尋過程中發生錯誤", "details": error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# 獲取音樂預覽 URL
@api_view(['GET'])
def get_preview_url(request, track_id):
    global spotify
    logger.info(f"請求音樂預覽 URL: track_id={track_id}")
    
    if not spotify and not initialize_spotify_client():
        logger.error("無法初始化 Spotify 客戶端")
        return Response(
            {"error": "無法連接到 Spotify 服務"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        track = spotify.track(track_id)
        preview_url = track.get('preview_url')
        
        if preview_url:
            logger.info("成功獲取預覽 URL")
            return Response({"preview_url": preview_url})
            
        logger.warning("該歌曲無預覽 URL")
        return Response(
            {"error": "該歌曲無預覽"},
            status=status.HTTP_404_NOT_FOUND
        )
        
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API 錯誤: {str(e)}")
        return Response(
            {"error": "無法獲取歌曲預覽"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except Exception as e:
        logger.error(f"獲取預覽 URL 時發生錯誤: {str(e)}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
