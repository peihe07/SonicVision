import requests
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Movie
from .serializers import MovieSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from dotenv import load_dotenv
import os

# TMDB API 設定
load_dotenv()

TMDB_API_URL = "https://api.themoviedb.org/3/search/movie"
TMDB_MOVIE_DETAIL_URL = "https://api.themoviedb.org/3/movie/"
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

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
class MovieViewSet(mixins.ListModelMixin,  # 允許 GET 列表
                   mixins.CreateModelMixin,  # 允許 POST
                   mixins.RetrieveModelMixin,  # 允許 GET 單筆
                   viewsets.GenericViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 允許讀取，修改需登入入

class SearchTMDBView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        return Response({"message": f"Searching for {query}"})


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
    year = request.GET.get("year", "")
    language = request.GET.get("language", "en-US")  # 預設英文
    include_adult = request.GET.get("include_adult", "false")
    region = request.GET.get("region", "")

    if not query:
        return Response({"error": "請提供 query 參數"}, status=400)

    params = {
        "api_key": TMDB_API_KEY,
        "query": query,
        "year": year,
        "language": language,
        "include_adult": include_adult,
        "region": region
    }

    try:
        response = requests.get(TMDB_API_URL, params=params, timeout=5)
        response.raise_for_status()
        return Response(response.json())  # ✅ 回傳 TMDB 數據
    except requests.exceptions.RequestException as e:
        return Response({"error": f"無法連接 TMDB: {str(e)}"}, status=500)
    
# 查詢 TMDB 電影詳情
@api_view(['GET'])
def get_tmdb_movie_detail(request, movie_id):
    url = f"{TMDB_MOVIE_DETAIL_URL}{movie_id}"
    params = {"api_key": TMDB_API_KEY}

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return Response(response.json())  # ✅ 成功時回傳電影資料
    except requests.exceptions.HTTPError as errh:
        return Response({"error": f"HTTP 錯誤: {str(errh)}"}, status=response.status_code)
    except requests.exceptions.RequestException as e:
        return Response({"error": f"請求失敗: {str(e)}"}, status=500)

