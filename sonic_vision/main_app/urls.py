from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from . import views
from movies.views import MovieViewSet
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('', views.home, name='home'),
    path('api/music/', include('music.urls')),
    path('api/movies/', include('movies.urls')), 
    path('api/users/', include('users.urls')),  
    path('admin/', admin.site.urls),
    path('api/token/', obtain_auth_token, name='api_token_auth'),  # 取得 Token
    path('api/users/', include('users.urls')),
    path('api/', include('api.urls')),
]

def Home(request):
    return HttpResponse("Welcome to Sonic Vision!")