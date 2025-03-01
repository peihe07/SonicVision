from django.urls import path
from .views import UserLibraryView, register_user, CustomTokenObtainPairView, user_profile
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('library/', UserLibraryView.as_view(), name='user-library'),
    path('register/', register_user, name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', user_profile, name='user_profile'),
]