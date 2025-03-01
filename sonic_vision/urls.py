from django.urls import path, include, re_path
from django.contrib import admin
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from main_app.views import index, search_tmdb
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/movies/', include('movies.urls')),
    path("api/music/", include("music.urls")),
    path('api/auth/', include('users.urls')),
    path('api/search-tmdb/', search_tmdb, name='search_tmdb'),  # API 路由
    re_path(r'^(?!api/).*$', index, name='index'),  # Vue 處理前端路由

]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])