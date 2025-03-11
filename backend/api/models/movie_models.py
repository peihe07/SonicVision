from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=255)
    director = models.CharField(max_length=255)
    release_year = models.IntegerField(blank=True, null=True)
    genre = models.CharField(max_length=100)
    tmdb_url = models.URLField(max_length=500, null=True, blank=True)
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    overview = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        app_label = 'api'  # 設定 app_label 適應新的 API 架構