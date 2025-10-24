from rest_framework import serializers
from .models import Booking, Seat

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'row', 'column', 'is_booked']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'showtime', 'user_name', 'user_email', 'seats_booked', 'status', 'created_at']
