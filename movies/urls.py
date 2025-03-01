from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieListCreateView, MovieDetailView, MovieViewSet

router = DefaultRouter()
router.register(r'movies', MovieViewSet)

urlpatterns = [
    path('list/', MovieListCreateView.as_view(), name='movie-list'),
    path('<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('', include(router.urls)),  # 包含 ViewSet 自動生成的 API 路由
]