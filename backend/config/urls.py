from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from .views import index
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('api.urls')),  # API 路由
    re_path(r'^(?!api/).*$', index, name='index'),  # 除了 /api 之外的所有路徑都返回前端頁面
]
