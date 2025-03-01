import requests
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from .models import Movie
from .serializers import MovieSerializer

TMDB_API_URL = "https://api.themoviedb.org/3/search/movie"
TMDB_API_KEY = "dd9128afca39a844176df49039e07839"

@api_view(['GET'])
def get_movie_list(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_tmdb_movie(request, query):
    params = {
        "api_key": TMDB_API_KEY,
        "query": query
    }
    response = requests.get(TMDB_API_URL, params=params)
    return Response(response.json())
# API 端點 - 電影列表 (GET) + 創建電影 (POST)
class MovieListCreateView(ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

# API 端點 - 單部電影詳情 (GET)
class MovieDetailView(RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

# 使用 ViewSet 來自動處理電影 API
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer