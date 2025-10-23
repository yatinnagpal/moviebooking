# booking_service/admin.py
from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user_email','showtime','seats_booked','amount_paid','booking_time')
    search_fields = ('user_email','showtime__movie__title')
