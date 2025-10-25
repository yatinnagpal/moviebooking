from django.contrib import admin
from .models import ShowTime

@admin.register(ShowTime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = ('movie', 'hall_name', 'start_time', 'seats_total', 'seats_available', 'price_per_ticket')
    list_filter = ('movie', 'hall_name', 'start_time')
    search_fields = ('movie__title', 'hall_name', 'start_time')
    fields = ('movie', 'hall_name', 'start_time', 'seats_total', 'seats_available', 'price_per_ticket', 'duration', 'rating', 'poster_url', 'release_date', 'created_at')
    search_fields = ('movie__title', 'hall_name', 'start_time')