from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register_user,
    CustomTokenObtainPairView,
    user_profile,
    user_list,
    UserLibraryView,
    protected_view
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', user_profile, name='user_profile'),
    path('users/', user_list, name='user_list'),
    path('library/', UserLibraryView.as_view(), name='user_library'),
    path('protected/', protected_view, name='protected_view'),
]
