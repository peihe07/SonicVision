from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator

User = get_user_model()

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('音樂', '音樂'),
        ('電影', '電影'),
        ('討論', '討論'),
        ('分享', '分享'),
        ('其他', '其他'),
    ]

    title = models.CharField(
        max_length=200,
        validators=[
            MinLengthValidator(1, message="標題不能為空"),
            MaxLengthValidator(200, message="標題不能超過200字")
        ]
    )
    content = models.TextField(
        validators=[
            MinLengthValidator(1, message="內容不能為空"),
            MaxLengthValidator(5000, message="內容不能超過5000字")
        ]
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.title.strip():
            raise ValidationError("標題不能為空")
        if not self.content.strip():
            raise ValidationError("內容不能為空")

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(
        validators=[
            MinLengthValidator(1, message="評論內容不能為空"),
            MaxLengthValidator(1000, message="評論內容不能超過1000字")
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.content.strip():
            raise ValidationError("評論內容不能為空")

class Playlist(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    spotify_id = models.CharField(max_length=255, blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='tracks')
    track_id = models.CharField(max_length=255)  # Spotify track ID
    added_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='added_tracks')
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position']
        unique_together = ['playlist', 'track_id']

    def __str__(self):
        return f"{self.track_id} in {self.playlist.name}"

class PlaylistCollaborator(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='collaborators')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collaborated_playlists')
    can_edit = models.BooleanField(default=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['playlist', 'user']

    def __str__(self):
        return f"{self.user.username} in {self.playlist.name}"

class Watchlist(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover = models.ImageField(upload_to='watchlist_covers/', null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlists')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    movie_count = models.IntegerField(default=0)
    watched_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} - {self.owner.username}"

class SmartPlaylist(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='smart_playlists')
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    criteria = models.JSONField()  # 存儲播放列表生成條件
    auto_update = models.BooleanField(default=True)
    last_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
