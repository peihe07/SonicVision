from django.urls import path
from api.views.user_views import (
    register_user,
    CustomTokenObtainPairView,
    user_profile,
    user_list,
    UserLibraryListCreateView,
    UserLibraryDetailView,
    protected_view,
)
from api.views.music_views import (
    MusicListCreateView,
    MusicDetailView,
    explore_music,
    search_track,
)
from api.views.movie_views import (
    MovieListCreateView,
    MovieDetailView,
    search_tmdb_movie,
    get_tmdb_movie_detail,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # ✅ 用戶 API
    path('users/register/', register_user, name='register-user'),
    path('users/token/', CustomTokenObtainPairView.as_view(), name='token-obtain'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('users/profile/', user_profile, name='user-profile'),
    path('users/list/', user_list, name='user-list'),
    path('users/protected/', protected_view, name='protected-view'),
    # ✅ 用戶收藏庫 API
    path('users/library/', UserLibraryListCreateView.as_view(), name='user-library'),
    path('users/library/<int:pk>/', UserLibraryDetailView.as_view(), name='user-library-detail'),

    # ✅ 音樂 API
    path('music/', MusicListCreateView.as_view(), name='music-list-create'),
    path('music/<int:pk>/', MusicDetailView.as_view(), name='music-detail'),
    path('music/explore/', explore_music, name='explore-music'),
    path('music/search/', search_track, name='search-track'),

    # ✅ 電影 API
    path('movies/', MovieListCreateView.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('movies/search/', search_tmdb_movie, name='search-tmdb-movie'),
    path('movies/<int:movie_id>/', get_tmdb_movie_detail, name='get-tmdb-movie-detail'),
]