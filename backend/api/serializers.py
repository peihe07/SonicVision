from rest_framework import serializers
from .models import Post, Comment, Playlist, Watchlist, PlaylistTrack, PlaylistCollaborator, SmartPlaylist
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

class PlaylistTrackSerializer(serializers.ModelSerializer):
    added_by = UserSerializer(read_only=True)

    class Meta:
        model = PlaylistTrack
        fields = ['id', 'track_id', 'added_at', 'added_by', 'position']
        read_only_fields = ['added_at', 'added_by']

class PlaylistCollaboratorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PlaylistCollaborator
        fields = ['id', 'user', 'can_edit', 'added_at']
        read_only_fields = ['added_at']

class PlaylistSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    tracks = PlaylistTrackSerializer(many=True, read_only=True)
    collaborators = PlaylistCollaboratorSerializer(many=True, read_only=True)
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = [
            'id', 'name', 'description', 'owner', 'is_public',
            'created_at', 'updated_at', 'spotify_id', 'cover_image',
            'tracks', 'collaborators', 'track_count'
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner']

    def get_track_count(self, obj):
        return obj.tracks.count()

class PlaylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['name', 'description', 'is_public']

    def create(self, validated_data):
        user = self.context['request'].user
        playlist = Playlist.objects.create(owner=user, **validated_data)
        return playlist

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

class SmartPlaylistSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = SmartPlaylist
        fields = [
            'id', 'name', 'description', 'owner', 'is_public',
            'created_at', 'updated_at', 'criteria', 'auto_update',
            'last_updated', 'track_count'
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner', 'last_updated']

    def get_track_count(self, obj):
        return obj.tracks.count()

class SmartPlaylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmartPlaylist
        fields = ['name', 'description', 'is_public', 'criteria', 'auto_update']

    def create(self, validated_data):
        user = self.context['request'].user
        playlist = SmartPlaylist.objects.create(owner=user, **validated_data)
        return playlist 