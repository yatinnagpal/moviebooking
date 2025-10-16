# api/models/booking.py
from django.db import models
from .showtime import Showtime

class Booking(models.Model):
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='bookings')
    user_email = models.EmailField()
    seats_booked = models.PositiveIntegerField()
    amount_paid = models.DecimalField(max_digits=8, decimal_places=2)
    booking_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-booking_time']

    def __str__(self):
        return f"{self.user_email} - {self.showtime.movie.title} ({self.seats_booked} seats)"
