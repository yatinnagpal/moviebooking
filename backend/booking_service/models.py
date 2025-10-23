# booking_service/models.py
from django.db import models
from django.utils import timezone
from showtime_service.models import ShowTime

class Booking(models.Model):
    showtime = models.ForeignKey(ShowTime, on_delete=models.CASCADE, related_name='bookings')
    user_email = models.EmailField()
    seats_booked = models.PositiveIntegerField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    booking_time = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-booking_time']

    def __str__(self):
        return f"{self.user_email} - {self.showtime.movie.title} ({self.seats_booked})"
