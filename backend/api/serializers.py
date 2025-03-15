from rest_framework import serializers
from .models import Post, Comment, Playlist, Watchlist
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'content', 'author', 'created_at')

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'author', 'category', 'created_at', 
                 'comments', 'likes_count', 'is_liked')
        read_only_fields = ('author',)

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class PlaylistSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    coverUrl = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'description', 'coverUrl', 'owner', 'created_at', 
                 'updated_at', 'is_public', 'song_count']

    def get_coverUrl(self, obj):
        if obj.cover:
            return self.context['request'].build_absolute_uri(obj.cover.url)
        return None

class WatchlistSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    coverUrl = serializers.SerializerMethodField()

    class Meta:
        model = Watchlist
        fields = ['id', 'name', 'description', 'coverUrl', 'owner', 'created_at',
                 'updated_at', 'is_public', 'movie_count', 'watched_count']

    def get_coverUrl(self, obj):
        if obj.cover:
            return self.context['request'].build_absolute_uri(obj.cover.url)
        return None 