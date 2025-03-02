from django.urls import path
from .views import MusicListCreateView, MusicDetailView, search_track, explore_music, music_list

urlpatterns = [
    path("", music_list, name="music-list"),
    path('<int:pk>/', MusicDetailView.as_view(), name='music-detail'),
    path('search/', search_track, name='search-track'),
    path('explore/', explore_music, name="explore_music"),
]