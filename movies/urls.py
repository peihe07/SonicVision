from django.urls import path
from .views import (
    get_movie_list, movie_list,
    search_tmdb_movie,
    MovieListCreateView,
    MovieDetailView
)

urlpatterns = [
    path("", movie_list, name="movie-list"),
    path("create/", MovieListCreateView.as_view(), name="movie-create"),
    path("<int:pk>/", MovieDetailView.as_view(), name="movie-detail"),
    path("search-tmdb/", search_tmdb_movie, name="search-tmdb"),
]