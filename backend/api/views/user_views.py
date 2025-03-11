from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View
from api.models.user_models import UserLibrary
from api.serializers.user_serializers import UserLibrarySerializer
from rest_framework.permissions import IsAuthenticated
from api.permissions.user_permissions import IsSelfOrReadOnly


# ✅ 1. 用戶註冊 API
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({"error": "用戶名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "註冊成功！"}, status=status.HTTP_201_CREATED)


# ✅ 2. 自訂 JWT Token 回應 (添加額外用戶資訊)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username  # 添加用戶名到 JWT Token
        return token


# ✅ 3. 自訂 Token 取得 View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ✅ 4. 用戶資料 API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "date_joined": request.user.date_joined,
    })


# ✅ 5. 用戶列表 API
@api_view(["GET"])
def user_list(request):
    users = User.objects.values("id", "username", "email", "date_joined")
    return Response({"users": list(users)})


# ✅ 6. 測試 API (User Library)
class UserLibraryView(View):
    def get(self, request):
        return JsonResponse({"message": "Hello from UserLibraryView"})
    
class UserLibraryListCreateView(generics.ListCreateAPIView):
    queryset = UserLibrary.objects.all()
    serializer_class = UserLibrarySerializer
    permission_classes = [IsAuthenticated]

class UserLibraryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserLibrary.objects.all()
    serializer_class = UserLibrarySerializer
    permission_classes = [IsAuthenticated, IsSelfOrReadOnly]


# ✅ 7. 測試受保護 API
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"username": request.user.username})