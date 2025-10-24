from django.contrib import admin
from .models import Booking, Seat

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('id', 'showtime', 'seat_number', 'is_booked', 'is_locked')
    list_filter = ('is_booked', 'is_locked', 'showtime')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'movie_title', 'show_start_time', 'status', 'seats_booked', 'user_name', 'booked_at')
    list_filter = ('status',)

    def movie_title(self, obj):
        return obj.showtime.movie.title if obj.showtime and obj.showtime.movie else "-"

    def show_start_time(self, obj):
        return obj.showtime.start_time if obj.showtime else "-"

    def seats_booked(self, obj):
        return obj.seats.count()

    movie_title.short_description = "Movie"
    show_start_time.short_description = "Showtime"
    seats_booked.short_description = "Seats"
