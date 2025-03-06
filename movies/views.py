import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets, mixins
from .models import Movie
from .serializers import MovieSerializer

# TMDB API 設定
TMDB_API_KEY = settings.TMDB_API_KEY
TMDB_API_URL = "https://api.themoviedb.org/3/search/multi"
TMDB_MOVIE_DETAIL_URL = "https://api.themoviedb.org/3/movie/"

# 🛠️ 統一的 TMDB API 請求函數
def fetch_from_tmdb(url, params):
    params["api_key"] = TMDB_API_KEY  # 加入 API 金鑰
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return response.json(), response.status_code
    except requests.exceptions.HTTPError as errh:
        return {"error": f"HTTP 錯誤: {str(errh)}"}, response.status_code if response else 500
    except requests.exceptions.RequestException as e:
        return {"error": f"請求失敗: {str(e)}"}, 500

# 🎬 電影列表 (本地資料庫)
class MovieListCreateView(ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 允許讀取，新增/修改需登入

# 🎞️ 單部電影詳情 (本地資料庫)
class MovieDetailView(RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

# 🔍 搜尋 TMDB 電影與影集
@api_view(["GET"])
def search_tmdb_movie(request):
    query = request.GET.get("query", "").strip()
    if not query:
        return JsonResponse({"error": "缺少 query 參數"}, status=400)

    language = request.GET.get("language", "zh-TW")  # 預設為繁體中文
    media_type = request.GET.get("media_type", "")  # 可選過濾 (movie, tv)
    
    params = {"query": query, "language": language}
    data, status_code = fetch_from_tmdb(TMDB_API_URL, params)

    if "error" in data:
        return JsonResponse(data, status=status_code)

    # 🛠️ 過濾不必要的欄位 + 可選的媒體類型篩選
    results = [
        {
            "id": item["id"],
            "title": item.get("title", item.get("name", "")),
            "overview": item.get("overview", ""),
            "release_date": item.get("release_date", ""),
            "poster_path": f"https://image.tmdb.org/t/p/w500{item['poster_path']}" if item.get("poster_path") else None,
            "media_type": item.get("media_type", "movie"),
        }
        for item in data.get("results", []) if not media_type or item.get("media_type") == media_type
    ]

    return JsonResponse({"results": results}, safe=False)

# 📌 查詢 TMDB 電影詳情
@api_view(['GET'])
def get_tmdb_movie_detail(request, movie_id):
    language = request.GET.get("language", "zh-TW")
    url = f"{TMDB_MOVIE_DETAIL_URL}{movie_id}"
    params = {"language": language}

    data, status_code = fetch_from_tmdb(url, params)

    if "error" in data:
        return JsonResponse(data, status=status_code)

    # 🛠️ 過濾不必要欄位
    movie_details = {
        "id": data.get("id"),
        "title": data.get("title", data.get("name", "")),
        "overview": data.get("overview", ""),
        "release_date": data.get("release_date", ""),
        "runtime": data.get("runtime"),
        "genres": [genre["name"] for genre in data.get("genres", [])],
        "poster_path": f"https://image.tmdb.org/t/p/w500{data['poster_path']}" if data.get("poster_path") else None,
        "backdrop_path": f"https://image.tmdb.org/t/p/w1280{data['backdrop_path']}" if data.get("backdrop_path") else None,
        "vote_average": data.get("vote_average"),
        "vote_count": data.get("vote_count"),
    }

    return JsonResponse(movie_details, safe=False)