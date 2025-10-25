from django.contrib import admin

from .models import ShowTime


@admin.register(ShowTime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = (
        "movie",
        "hall_name",
        "start_time",
        "seats_total",
        "seats_available",
        "price_per_ticket",
    )
    list_filter = ("movie", "hall_name", "start_time")
