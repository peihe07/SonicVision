from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer
from django.conf import settings
import requests
import jwt
from datetime import datetime, timedelta
import json

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })

    def put(self, request):
        user = request.user
        data = request.data
        
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
            
        user.save()
        return Response({
            'message': 'Profile updated successfully',
            'id': user.id,
            'username': user.username,
            'email': user.email
        })

class GoogleAuthView(APIView):
    def post(self, request):
        try:
            # 獲取前端傳來的 Google 授權碼
            code = request.data.get('code')
            redirect_uri = request.data.get('redirect_uri')
            
            if not code:
                return Response({'error': '未提供授權碼'}, 
                              status=status.HTTP_400_BAD_REQUEST)

            # 使用授權碼換取TOKEN
            token_url = 'https://oauth2.googleapis.com/token'
            token_data = {
                'code': code,
                'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }

            token_response = requests.post(token_url, data=token_data)
            if not token_response.ok:
                return Response({'error': '無法獲取訪問TOKEN'}, 
                              status=status.HTTP_400_BAD_REQUEST)

            token_data = token_response.json()
            access_token = token_data.get('access_token')

            # 使用TOKEN獲取用戶資料
            userinfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
            userinfo_response = requests.get(
                userinfo_url,
                headers={'Authorization': f'Bearer {access_token}'}
            )

            if not userinfo_response.ok:
                return Response({'error': '無法獲取用戶資料'}, 
                              status=status.HTTP_400_BAD_REQUEST)

            userinfo = userinfo_response.json()

            # 獲取或創建用戶
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            try:
                user = User.objects.get(email=userinfo['email'])
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=userinfo['email'].split('@')[0],
                    email=userinfo['email'],
                    password=None  # 使用 OAuth 的用戶不需要密碼
                )

            # 生成 JWT token
            access_token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(minutes=60)
            }, settings.SECRET_KEY, algorithm='HS256')

            refresh_token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(days=7)
            }, settings.SECRET_KEY, algorithm='HS256')

            return Response({
                'token': access_token,
                'refresh': refresh_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })

        except Exception as e:
            print('Google OAuth 錯誤:', str(e))  # 添加日誌
            return Response({'error': '認證失敗'}, 
                          status=status.HTTP_400_BAD_REQUEST) 