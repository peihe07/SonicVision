import requests
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Movie
from .serializers import MovieSerializer

# TMDB API 設定
TMDB_API_URL = "https://api.themoviedb.org/3/search/movie"
TMDB_MOVIE_DETAIL_URL = "https://api.themoviedb.org/3/movie/"
TMDB_API_KEY = "dd9128afca39a844176df49039e07839"

# 獲取本地資料庫電影清單
@api_view(['GET'])
def get_movie_list(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

# 搜尋 TMDB 電影
@api_view(["GET"])
def search_tmdb_movie(request):
    query = request.GET.get("query", "")
    if not query:
        return Response({"error": "請提供 query 參數"}, status=400)

    params = {
        "api_key": TMDB_API_KEY,
        "query": query
    }

    print(f"📡 發送請求至 TMDB: {TMDB_API_URL}，參數: {params}")

    try:
        response = requests.get(TMDB_API_URL, params=params, timeout=5)
        response.raise_for_status()
        print(f"✅ TMDB 回應: {response.json()}")  # 🔹 確保 TMDB API 回應內容

        return Response(response.json())  # ✅ 回傳 TMDB 數據
    except requests.exceptions.RequestException as e:
        print(f"❌ TMDB 請求失敗: {str(e)}")
        return Response({"error": f"無法連接 TMDB: {str(e)}"}, status=500)

# 查詢 TMDB 電影詳情
@api_view(['GET'])
def get_tmdb_movie_detail(request, movie_id):
    url = f"{TMDB_MOVIE_DETAIL_URL}{movie_id}"
    params = {"api_key": TMDB_API_KEY}
    response = requests.get(url, params=params)

    if response.status_code != 200:
        return Response({"error": "Failed to fetch movie details"}, status=response.status_code)

    return Response(response.json())

# 電影列表 (GET) + 創建電影 (POST)
class MovieListCreateView(ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 允許讀取，新增/修改需登入

# 單部電影詳情 (GET)
class MovieDetailView(RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

# 使用 ViewSet 來自動處理電影 API
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 讀取開放，寫入需登入