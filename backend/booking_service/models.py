from django.db import models
from django.utils import timezone


class Booking(models.Model):
    showtime = models.ForeignKey('showtime_service.ShowTime', on_delete=models.CASCADE, related_name='bookings')
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    seats_booked = models.PositiveIntegerField(default=1) 
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ], default='pending')

    def __str__(self):
        return f"{self.user_name} - {self.showtime.movie.title} ({self.status})"
