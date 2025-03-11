from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # 避免與 auth.User 衝突
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",  # 避免與 auth.User 衝突
        blank=True
    )

class UserLibrary(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # 關聯用戶
    favorite_music = models.JSONField(default=list)  # 收藏的音樂（JSON 格式）
    favorite_movies = models.JSONField(default=list)  # 收藏的電影（JSON 格式）

    def __str__(self):
        return f"{self.user.username} 的收藏庫"