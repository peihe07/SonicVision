from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, action, permission_classes
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
from .models import Post, Comment, Playlist, Watchlist
from .serializers import PostSerializer, CommentSerializer, PlaylistSerializer, WatchlistSerializer
from rest_framework import serializers
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend, AuthTokenError, AuthForbidden
from django.db import models
from django.conf import settings

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
        
        logger.info("正在獲取token...")
        response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)
        
        if response.status_code != 200:
            logger.error(f"獲取token失敗: {response.status_code} - {response.text}")
            return False
            
        access_token = response.json().get('access_token')
        if not access_token:
            logger.error("回應中沒有token")
            return False
            
        logger.info("成功獲取token")
        
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
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password:
            return Response({
                "error": "用戶名和密碼為必填項"
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({
                "error": "用戶名稱已存在"
            }, status=status.HTTP_400_BAD_REQUEST)

        if email and User.objects.filter(email=email).exists():
            return Response({
                "error": "電子郵件已被使用"
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # 生成 JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "註冊成功！",
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"註冊失敗: {str(e)}")
        return Response({
            "error": "註冊過程中發生錯誤"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ✅ 2. 自訂 JWT Token 回應 (添加額外用戶資訊)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
        }
        return data


# ✅ 3. 自訂 Token 取得 View
@method_decorator(csrf_exempt, name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ✅ 4. 用戶資料 API
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
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
@permission_classes([permissions.IsAuthenticated])
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
        error_msg = "無法初始化 Spotify 客戶端"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        track = spotify.track(track_id)
        preview_url = track.get('preview_url')
        
        if not preview_url:
            error_msg = "該歌曲無預覽版本"
            logger.warning(error_msg)
            return Response(
                {"error": error_msg},
                status=status.HTTP_404_NOT_FOUND
            )
            
        logger.info(f"成功獲取預覽 URL: {preview_url}")
        return Response({"preview_url": preview_url})
        
    except spotipy.exceptions.SpotifyException as e:
        error_msg = f"Spotify API 錯誤: {str(e)}"
        logger.error(error_msg)
        
        if "invalid id" in str(e).lower():
            return Response(
                {"error": "無效的歌曲 ID"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        return Response(
            {"error": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except Exception as e:
        error_msg = f"獲取預覽 URL 時發生錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Post.objects.all()
        category = self.request.query_params.get('category', None)
        if category and category != '全部':
            queryset = queryset.filter(category=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        try:
            post = self.get_object()
            if post.likes.filter(id=request.user.id).exists():
                post.likes.remove(request.user)
                return Response({'status': 'unliked'})
            else:
                post.likes.add(request.user)
                return Response({'status': 'liked'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        try:
            return Comment.objects.filter(post_id=self.kwargs['post_pk'])
        except Exception as e:
            return Comment.objects.none()

    def perform_create(self, serializer):
        try:
            post = Post.objects.get(pk=self.kwargs['post_pk'])
            serializer.save(author=self.request.user, post=post)
        except Post.DoesNotExist:
            raise serializers.ValidationError({'post': '貼文不存在'})
        except Exception as e:
            raise serializers.ValidationError(str(e))

class Custom404View(View):
    def dispatch(self, request, *args, **kwargs):
        return JsonResponse({
            'error': '找不到請求的資源',
            'status': 404
        }, status=404)

class Custom500View(View):
    def dispatch(self, request, *args, **kwargs):
        return JsonResponse({
            'error': '伺服器內部錯誤',
            'status': 500
        }, status=500)

def custom_404(request, exception=None):
    return Custom404View.as_view()(request)

def custom_500(request):
    return Custom500View.as_view()(request)

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'detail': 'CSRF cookie set'})

class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.AllowAny]  # 允許所有用戶訪問

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]  # 創建、更新和刪除需要登入
        return [permissions.AllowAny()]  # 其他操作允許所有人

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Playlist.objects.filter(is_public=True)
        return Playlist.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(is_public=True)
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.AllowAny]  # 允許所有用戶訪問

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]  # 創建、更新和刪除需要登入
        return [permissions.AllowAny()]  # 其他操作允許所有人

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Watchlist.objects.filter(is_public=True)
        return Watchlist.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(is_public=True)
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@api_view(['POST'])
def google_login(request):
    try:
        # 獲取 Google 的 access token
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({
                'error': '缺少 access token'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 使用 social-auth-app-django 進行身份驗證
        strategy = load_strategy(request)
        backend = load_backend(strategy=strategy, name='google-oauth2', redirect_uri=None)

        try:
            user = backend.do_auth(access_token)
        except AuthTokenError as e:
            return Response({
                'error': '無效的 token'
            }, status=status.HTTP_400_BAD_REQUEST)
        except AuthForbidden as e:
            return Response({
                'error': '帳號被禁用'
            }, status=status.HTTP_403_FORBIDDEN)

        if user:
            # 生成 JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        else:
            return Response({
                'error': '無法驗證 Google 帳號'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Google 登入失敗: {str(e)}")
        return Response({
            'error': '登入過程中發生錯誤'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def spotify_featured_playlists(request):
    """獲取 Spotify 推薦歌單"""
    global spotify
    
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
        logger.info("獲取 Spotify 推薦歌單")
        
        # 獲取熱門歌手
        results = spotify.search(
            q='genre:mandopop',  # 搜尋華語流行音樂
            type='artist',
            market='TW',
            limit=5
        )
        
        if not results or 'artists' not in results:
            raise Exception("無法獲取歌手資訊")
            
        # 獲取歌手的熱門歌單
        playlists = []
        for artist in results['artists']['items']:
            try:
                # 搜尋與歌手相關的歌單
                artist_playlists = spotify.search(
                    q=f"artist:{artist['name']}",
                    type='playlist',
                    market='TW',
                    limit=4
                )
                
                if artist_playlists and 'playlists' in artist_playlists:
                    playlists.extend(artist_playlists['playlists']['items'])
            except Exception as e:
                logger.warning(f"獲取歌手 {artist['name']} 的歌單時發生錯誤: {str(e)}")
                continue
        
        # 格式化回應
        response_data = {
            'playlists': {
                'items': playlists[:20],  # 限制返回 20 個歌單
                'total': len(playlists)
            }
        }
        
        logger.info(f"成功獲取推薦歌單，共 {len(playlists)} 個")
        return Response(response_data)
        
    except spotipy.exceptions.SpotifyException as e:
        error_msg = f"Spotify API 錯誤: {str(e)}"
        logger.error(error_msg)
        
        if "unauthorized" in str(e).lower():
            logger.info("嘗試重新初始化 Spotify 客戶端")
            if initialize_spotify_client():
                try:
                    results = spotify.search(
                        q='genre:mandopop',
                        type='artist',
                        market='TW',
                        limit=5
                    )
                    
                    playlists = []
                    for artist in results['artists']['items']:
                        artist_playlists = spotify.search(
                            q=f"artist:{artist['name']}",
                            type='playlist',
                            market='TW',
                            limit=4
                        )
                        if artist_playlists and 'playlists' in artist_playlists:
                            playlists.extend(artist_playlists['playlists']['items'])
                    
                    response_data = {
                        'playlists': {
                            'items': playlists[:20],
                            'total': len(playlists)
                        }
                    }
                    return Response(response_data)
                except Exception as retry_error:
                    error_msg = f"重試獲取歌單失敗: {str(retry_error)}"
                    logger.error(error_msg)
                    return Response(
                        {"error": "獲取歌單失敗", "details": error_msg},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
        
        return Response(
            {"error": "獲取歌單失敗", "details": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except Exception as e:
        error_msg = f"未預期的錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": "獲取歌單過程中發生錯誤", "details": error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def tmdb_featured_lists(request):
    """獲取 TMDB 全球評分最高的電影"""
    if not settings.TMDB_API_KEY:
        error_msg = "TMDB API Key 未設置"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    try:
        logger.info("獲取 TMDB 全球評分最高的電影")
        # 使用 top_rated 端點獲取全球評分最高的電影
        response = requests.get(
            'https://api.themoviedb.org/3/movie/top_rated',
            params={
                'api_key': settings.TMDB_API_KEY,
                'language': 'zh-TW',  # 使用繁體中文
                'page': 1,
                'include_adult': False  # 排除成人內容
            }
        )
        
        if response.status_code == 401:
            error_msg = "無效的 TMDB API Key"
            logger.error(error_msg)
            return Response(
                {"error": error_msg},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        if response.status_code == 404:
            error_msg = "TMDB API 端點不存在"
            logger.error(error_msg)
            return Response(
                {"error": error_msg},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if response.status_code != 200:
            error_msg = f"TMDB API 錯誤: {response.status_code}"
            logger.error(f"{error_msg} - {response.text}")
            return Response(
                {"error": error_msg},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        data = response.json()
        
        # 格式化電影資訊
        formatted_movies = []
        for movie in data.get('results', []):
            # 獲取電影詳細資訊
            movie_detail_response = requests.get(
                f'https://api.themoviedb.org/3/movie/{movie["id"]}',
                params={
                    'api_key': settings.TMDB_API_KEY,
                    'language': 'zh-TW',
                    'append_to_response': 'credits,videos,similar'
                }
            )
            
            if movie_detail_response.status_code == 200:
                movie_detail = movie_detail_response.json()
                
                # 處理演員資訊
                cast = []
                if 'credits' in movie_detail and 'cast' in movie_detail['credits']:
                    cast = [{
                        'id': actor['id'],
                        'name': actor['name'],
                        'character': actor['character'],
                        'profile_path': f"https://image.tmdb.org/t/p/w185{actor['profile_path']}" if actor['profile_path'] else None
                    } for actor in movie_detail['credits']['cast'][:5]]  # 只取前5位演員
                
                # 處理預告片
                videos = []
                if 'videos' in movie_detail and 'results' in movie_detail['videos']:
                    videos = [{
                        'id': video['id'],
                        'key': video['key'],
                        'site': video['site'],
                        'type': video['type']
                    } for video in movie_detail['videos']['results'] if video['site'] == 'YouTube'][:2]  # 只取前2個YouTube預告片
                
                # 處理類似電影
                similar_movies = []
                if 'similar' in movie_detail and 'results' in movie_detail['similar']:
                    similar_movies = [{
                        'id': similar['id'],
                        'title': similar['title'],
                        'poster_path': f"https://image.tmdb.org/t/p/w200{similar['poster_path']}" if similar['poster_path'] else None,
                        'vote_average': round(float(similar['vote_average']), 1)
                    } for similar in movie_detail['similar']['results'][:6]]  # 只取前6部類似電影
                
                formatted_movie = {
                    'id': movie['id'],
                    'title': movie['title'],
                    'original_title': movie_detail.get('original_title'),
                    'overview': movie['overview'],
                    'poster_path': f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie['poster_path'] else None,
                    'backdrop_path': f"https://image.tmdb.org/t/p/original{movie['backdrop_path']}" if movie['backdrop_path'] else None,
                    'vote_average': round(float(movie['vote_average']), 1),
                    'vote_count': movie['vote_count'],
                    'release_date': movie['release_date'],
                    'release_year': movie['release_date'][:4] if movie['release_date'] else None,
                    'runtime': movie_detail.get('runtime'),
                    'genres': [genre['name'] for genre in movie_detail.get('genres', [])],
                    'production_countries': [country['name'] for country in movie_detail.get('production_countries', [])],
                    'spoken_languages': [lang['name'] for lang in movie_detail.get('spoken_languages', [])],
                    'budget': movie_detail.get('budget'),
                    'revenue': movie_detail.get('revenue'),
                    'cast': cast,
                    'videos': videos,
                    'similar_movies': similar_movies,
                    'status': movie_detail.get('status'),
                    'tagline': movie_detail.get('tagline'),
                    'popularity': movie_detail.get('popularity')
                }
                formatted_movies.append(formatted_movie)
        
        # 按評分降序排序
        formatted_movies.sort(key=lambda x: (x['vote_average'], x['vote_count']), reverse=True)
        
        response_data = {
            'results': formatted_movies,
            'total_results': len(formatted_movies)
        }
        
        logger.info(f"成功獲取 TMDB 全球評分最高的電影，共 {len(formatted_movies)} 部")
        return Response(response_data)
        
    except requests.exceptions.RequestException as e:
        error_msg = f"請求 TMDB API 時發生錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except Exception as e:
        error_msg = f"未預期的錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def tmdb_movie_detail(request, movie_id):
    """獲取 TMDB 電影詳細信息"""
    if not settings.TMDB_API_KEY:
        error_msg = "TMDB API Key 未設置"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    try:
        logger.info(f"獲取電影 ID {movie_id} 的詳細信息")
        
        # 獲取電影詳細信息
        response = requests.get(
            f'https://api.themoviedb.org/3/movie/{movie_id}',
            params={
                'api_key': settings.TMDB_API_KEY,
                'language': 'zh-TW',
                'append_to_response': 'credits,videos,similar'
            }
        )
        
        if response.status_code == 401:
            error_msg = "無效的 TMDB API Key"
            logger.error(error_msg)
            return Response(
                {"error": error_msg},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        if response.status_code == 404:
            error_msg = "找不到此電影"
            logger.error(error_msg)
            return Response(
                {"error": error_msg},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if response.status_code != 200:
            error_msg = f"TMDB API 錯誤: {response.status_code}"
            logger.error(f"{error_msg} - {response.text}")
            return Response(
                {"error": error_msg},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        movie_detail = response.json()
        
        # 處理演員信息
        cast = []
        if 'credits' in movie_detail and 'cast' in movie_detail['credits']:
            cast = [{
                'id': actor['id'],
                'name': actor['name'],
                'character': actor['character'],
                'profile_path': f"https://image.tmdb.org/t/p/w185{actor['profile_path']}" if actor['profile_path'] else None
            } for actor in movie_detail['credits']['cast'][:5]]  # 只取前5位演員
        
        # 處理預告片
        videos = []
        if 'videos' in movie_detail and 'results' in movie_detail['videos']:
            videos = [{
                'id': video['id'],
                'key': video['key'],
                'site': video['site'],
                'type': video['type']
            } for video in movie_detail['videos']['results'] if video['site'] == 'YouTube'][:2]  # 只取前2個YouTube預告片
        
        # 處理類似電影
        similar_movies = []
        if 'similar' in movie_detail and 'results' in movie_detail['similar']:
            similar_movies = [{
                'id': similar['id'],
                'title': similar['title'],
                'poster_path': f"https://image.tmdb.org/t/p/w200{similar['poster_path']}" if similar['poster_path'] else None,
                'vote_average': round(float(similar['vote_average']), 1)
            } for similar in movie_detail['similar']['results'][:6]]  # 只取前6部類似電影
        
        formatted_movie = {
            'id': movie_detail['id'],
            'title': movie_detail['title'],
            'original_title': movie_detail.get('original_title'),
            'overview': movie_detail['overview'],
            'poster_path': f"https://image.tmdb.org/t/p/w500{movie_detail['poster_path']}" if movie_detail['poster_path'] else None,
            'backdrop_path': f"https://image.tmdb.org/t/p/original{movie_detail['backdrop_path']}" if movie_detail['backdrop_path'] else None,
            'vote_average': round(float(movie_detail['vote_average']), 1),
            'vote_count': movie_detail['vote_count'],
            'release_date': movie_detail['release_date'],
            'release_year': movie_detail['release_date'][:4] if movie_detail['release_date'] else None,
            'runtime': movie_detail.get('runtime'),
            'genres': [genre['name'] for genre in movie_detail.get('genres', [])],
            'production_countries': [country['name'] for country in movie_detail.get('production_countries', [])],
            'spoken_languages': [lang['name'] for lang in movie_detail.get('spoken_languages', [])],
            'budget': movie_detail.get('budget'),
            'revenue': movie_detail.get('revenue'),
            'cast': cast,
            'videos': videos,
            'similar_movies': similar_movies,
            'status': movie_detail.get('status'),
            'tagline': movie_detail.get('tagline'),
            'popularity': movie_detail.get('popularity')
        }
        
        logger.info(f"成功獲取電影 {movie_id} 的詳細信息")
        return Response(formatted_movie)
        
    except requests.exceptions.RequestException as e:
        error_msg = f"請求 TMDB API 時發生錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except Exception as e:
        error_msg = f"未預期的錯誤: {str(e)}"
        logger.error(error_msg)
        return Response(
            {"error": error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
