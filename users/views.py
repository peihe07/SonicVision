from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework import status
from django.views import View
from django.http import JsonResponse
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def register_user(request):
    """
    用戶註冊 API
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({"error": "用戶名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "註冊成功！"}, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username  # 可自訂額外的回傳資訊
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserLibraryView(View):
    def get(self, request):
        return JsonResponse({"message": "Hello from UserLibraryView"})

@api_view(['GET'])
def user_profile(request):
    """
    取得當前登入用戶的資訊
    """
    if not request.user.is_authenticated:
        return Response({"error": "未授權"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "date_joined": request.user.date_joined,
    })

def user_list(request):
    return JsonResponse({"users": []})