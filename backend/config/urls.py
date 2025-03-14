from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # API 路由
    re_path(r'^.*$', index, name='index'),  # 所有其他路徑都返回前端頁面
]
