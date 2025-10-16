# api/models/showtime.py
from django.db import models
from .movie import Movie

class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    hall_name = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    seats_total = models.PositiveIntegerField(default=100)
    seats_available = models.PositiveIntegerField(default=100)
    price_per_ticket = models.DecimalField(max_digits=6, decimal_places=2, default=200.00)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.movie.title} - {self.start_time.strftime('%d %b %Y %I:%M %p')}"
