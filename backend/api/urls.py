from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register_user,
    CustomTokenObtainPairView,
    user_profile,
    user_list,
    UserLibraryView,
    protected_view,
    spotify_search,
    get_preview_url,
    PostViewSet,
    CommentViewSet,
    get_csrf_token,
    PlaylistViewSet,
    WatchlistViewSet,
    google_login,
    spotify_featured_playlists,
    tmdb_featured_lists,
    tmdb_movie_detail,
    set_refresh_token,
    clear_refresh_token,
    refresh_token,
    PlaylistCoverUploadView,
    PlaylistShareView,
)
from rest_framework.routers import DefaultRouter
from django.conf.urls import handler404, handler500

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'posts/(?P<post_pk>\d+)/comments', CommentViewSet, basename='comment')
router.register(r'playlists', PlaylistViewSet, basename='playlist')
router.register(r'watchlists', WatchlistViewSet, basename='watchlist')

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', refresh_token, name='token_refresh'),
    path('auth/set-refresh-token/', set_refresh_token, name='set_refresh_token'),
    path('auth/clear-refresh-token/', clear_refresh_token, name='clear_refresh_token'),
    path('auth/google/', google_login, name='google_login'),
    path('auth/profile/', user_profile, name='user_profile'),
    path('users/', user_list, name='user_list'),
    path('library/', UserLibraryView.as_view(), name='user_library'),
    path('protected/', protected_view, name='protected'),
    path('spotify/search/', spotify_search, name='spotify_search'),
    path('spotify/preview/<str:track_id>/', get_preview_url, name='get_preview_url'),
    path('spotify/featured-playlists/', spotify_featured_playlists, name='spotify_featured_playlists'),
    path('tmdb/featured-lists/', tmdb_featured_lists, name='tmdb_featured_lists'),
    path('tmdb/movies/<int:movie_id>/', tmdb_movie_detail, name='tmdb_movie_detail'),
    path('playlists/<int:playlist_id>/cover/', PlaylistCoverUploadView.as_view(), name='playlist-cover-upload'),
    path('playlists/<int:playlist_id>/share/', PlaylistShareView.as_view(), name='playlist-share'),
    path('playlists/share/<str:share_code>/', PlaylistShareView.as_view(), name='playlist-share-view'),
    path('', include(router.urls)),
]

# 自定義錯誤處理
handler404 = 'api.views.custom_404'
handler500 = 'api.views.custom_500'
