from rest_framework import serializers
from .models import UserLibrary
from music.serializers import MusicSerializer 
from movies.serializers import MovieSerializer
from django.contrib.auth import get_user_model

class UserLibrarySerializer(serializers.ModelSerializer):
    favorite_music = MusicSerializer(many=True, read_only=True)
    favorite_movies = MovieSerializer(many=True, read_only=True)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio']

    class Meta:
        model = UserLibrary
        fields = '__all__'