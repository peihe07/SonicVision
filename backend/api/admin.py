from django.contrib import admin
from api.models.user_models import CustomUser
from api.models.music_models import Music
from api.models.movie_models import Movie

admin.site.register(CustomUser)
admin.site.register(Music)
admin.site.register(Movie)