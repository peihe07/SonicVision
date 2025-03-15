from django.urls import path
from .views import RegisterView, UserProfileView, GoogleAuthView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('google/', GoogleAuthView.as_view(), name='google_auth'),
] 