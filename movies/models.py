from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=255)
    director = models.CharField(max_length=255)
    release_year = models.IntegerField()
    genre = models.CharField(max_length=100)
    tmdb_url = models.URLField(max_length=500, null=True, blank=True)
    poster_image = models.URLField(max_length=500, null=True, blank=True)
    overview = models.TextField(null=True, blank=True)

def __str__(self):
    return self.title
    
class Meta:
    app_label = 'movies'