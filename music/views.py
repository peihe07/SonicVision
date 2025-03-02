from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import requests
from rest_framework.generics import ListCreateAPIView
from .models import Music
from .serializers import MusicSerializer
from rest_framework.generics import RetrieveAPIView

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_URL = "https://api.spotify.com/v1/search"

# 音樂列表 API (GET + POST)
class MusicListCreateView(ListCreateAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

# 取得單首音樂詳情 (GET)
class MusicDetailView(RetrieveAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

def get_spotify_access_token():
    """
    向 Spotify 請求 Access Token
    """
    auth_response = requests.post(SPOTIFY_AUTH_URL, {
        'grant_type': 'client_credentials',
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET,
    })

    if auth_response.status_code == 200:
        return auth_response.json().get('access_token')
    else:
        return None

def music_list(request):
    return JsonResponse({"music": []})  # 這是一個簡單的測試回應

@api_view(['GET'])
def explore_music(request):
    """
    搜尋 Spotify 音樂，並回傳給 Vue
    """
    access_token = get_spotify_access_token()
    if not access_token:
        return Response({"error": "Failed to authenticate with Spotify"}, status=400)

    query = request.GET.get("q", "top hits")  # 預設搜尋熱門歌曲
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"q": query, "type": "track", "limit": 12}

    response = requests.get(SPOTIFY_API_URL, headers=headers, params=params)

    if response.status_code == 200:
        return Response(response.json())
    else:
        return Response({"error": "Failed to fetch data from Spotify"}, status=response.status_code)

@api_view(['GET'])
def search_track(request):
    """ 搜尋 Spotify 音樂 """
    access_token = get_spotify_access_token()
    if not access_token:
        return Response({"error": "Failed to authenticate with Spotify"}, status=400)

    query = request.GET.get("q", "")
    if not query:
        return Response({"error": "Query parameter is required"}, status=400)

    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"q": query, "type": "track", "limit": 10}

    response = requests.get(SPOTIFY_API_URL, headers=headers, params=params)

    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch data from Spotify"}, status=response.status_code)