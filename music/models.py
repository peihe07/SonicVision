from django.db import models

class Music(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255, blank=True, null=True)
    spotify_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"