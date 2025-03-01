from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from . import views
from movies.views import MovieViewSet
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from .views import search_tmdb

# 設定 REST Framework ViewSet 路由
router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),

    # API 路由
    path('api/music/', include('music.urls')),
    path('api/movies/', include('movies.urls')),  # 確保 movies.urls 存在
    path('api/users/', include('users.urls')),  
    path('api/', include(router.urls)),  # 註冊 ViewSet 路由
    path('api/token/', obtain_auth_token, name='api_token_auth'),  # Token 驗證
    path('api/search-tmdb/', search_tmdb, name='search_tmdb'),
]