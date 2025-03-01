from django.urls import path
from .views import MusicListCreateView, MusicDetailView, search_track, explore_music

urlpatterns = [
    path('', MusicListCreateView.as_view(), name='music-list-create'),
    path('<int:pk>/', MusicDetailView.as_view(), name='music-detail'),
    path('search/', search_track, name='search-track'),
    path('explore/', explore_music, name="explore_music"),
]