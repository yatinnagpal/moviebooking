from django.contrib import admin

from .models import Movie


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "description",
        "genre",
        "duration",
        "rating",
        "poster_url",
        "release_date",
        "created_at",
    )
    search_fields = ("title", "genre")
