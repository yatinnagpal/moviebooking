from django.db import models
from django.utils import timezone
from showtime_service.models import ShowTime

class Seat(models.Model):
    showtime = models.ForeignKey(ShowTime, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    is_booked = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    locked_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.showtime.movie.title} - {self.seat_number}"


class Booking(models.Model):
    showtime = models.ForeignKey(ShowTime, on_delete=models.CASCADE, related_name='bookings')
    seats = models.ManyToManyField(Seat)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    booked_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ], default='pending')

    def __str__(self):
        return f"{self.user_name} - {self.showtime.movie.title} ({self.status})"
