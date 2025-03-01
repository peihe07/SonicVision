from django.urls import path, include, re_path
from django.contrib import admin
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🔹 API 路由
    path('api/users/', include('users.urls')),
    path('api/movies/', include('movies.urls')),
    path("api/music/", include("music.urls")),
    path('api/auth/', include('users.urls')),

    # 🔹 讓 Django 提供 Vue 的 `index.html`
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html"), name="home"),

]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])