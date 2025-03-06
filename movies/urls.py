from django.urls import path
from .views import (
    search_tmdb_movie, get_tmdb_movie_detail,
    MovieListCreateView, MovieDetailView
)

urlpatterns = [
    # 🎬 本地電影 API
    path("", MovieListCreateView.as_view(), name="movie-list"),  # 取得電影列表 & 新增電影
    path("<int:pk>/", MovieDetailView.as_view(), name="movie-detail"),  # 取得單部電影

    # 🔍 TMDB API
    path("tmdb/search/", search_tmdb_movie, name="search-tmdb"),  # 搜尋 TMDB 電影
    path("tmdb/detail/<int:movie_id>/", get_tmdb_movie_detail, name="tmdb-movie-detail"),  # 取得單部 TMDB 電影詳情
]