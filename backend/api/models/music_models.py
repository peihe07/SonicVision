from django.db import models

class Music(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255, blank=True, null=True)
    spotify_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"

    class Meta:
        app_label = 'api'  # 設定 app_label 適應新的 API 架構