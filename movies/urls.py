from django.urls import path
from .views import (
    get_movie_list,
    search_tmdb_movie,
    get_tmdb_movie_detail,
    MovieListCreateView,
    MovieDetailView
)

urlpatterns = [
    path("movies/", get_movie_list, name="movie-list"),
    path("movies/create/", MovieListCreateView.as_view(), name="movie-create"),
    path("movies/<int:pk>/", MovieDetailView.as_view(), name="movie-detail"),
    path("search-tmdb/", search_tmdb_movie, name="search-tmdb"),  # 搜尋 TMDB 電影
    path("tmdb-movie/<int:movie_id>/", get_tmdb_movie_detail, name="tmdb-movie-detail"),  # 取得 TMDB 詳細資料
]