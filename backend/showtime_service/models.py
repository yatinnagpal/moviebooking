from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from movie_service.models import Movie


BUFFER_MINUTES = 15

class ShowTime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    hall_name = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    seats_total = models.PositiveIntegerField(default=100)
    seats_available = models.PositiveIntegerField(default=100)
    price_per_ticket = models.DecimalField(max_digits=10, decimal_places=2, default=200.00)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.movie.title} - {self.hall_name} - {self.start_time}"

    def _ensure_seats_default(self):
        if not self.pk:
            if self.seats_available is None or self.seats_available == 0:
                self.seats_available = self.seats_total

    def _validate_seats(self):
        if self.seats_available > self.seats_total:
            raise ValidationError("Available seats cannot exceed total seats.")
        
    def _validate_start_not_past(self):
        # Make sure both times are timezone-aware
        current_time = timezone.now()
        start_time = self.start_time

        if timezone.is_naive(start_time):
            start_time = timezone.make_aware(start_time, timezone.get_current_timezone())

        if start_time < current_time:
            raise ValidationError("Showtime start time cannot be in the past.")

        
    def _get_end_time(self, buffer_minutes=BUFFER_MINUTES):
        duration = self.movie.duration if (self.movie and self.movie.duration) else 0
        return self.start_time + timedelta(minutes=duration + buffer_minutes)
    
    def _find_overlapping_shows(self, buffer_minutes=BUFFER_MINUTES):
        qs = ShowTime.objects.filter(hall_name=self.hall_name).exclude(pk=self.pk)
        overlaps = []
        this_start = self.start_time
        this_end = self._get_end_time(buffer_minutes=buffer_minutes)
        for s in qs.select_related('movie'):
            other_start = s.start_time
            other_end = s.start_time + timedelta(minutes=s.movie.duration + buffer_minutes)
            if this_start < other_end and this_end > other_start:
                overlaps.append(s)
        return overlaps

    def clean(self):
        self._validate_seats()
        self._validate_start_not_past()
        if not self.movie and self.movie.duration is None:
            raise ValidationError({'movie': "Movie must have duration (minutes) set before creating showtime."})
        overlaps = self._find_overlapping_shows()
        if overlaps:
            conflicts = ", ".join([f"{o.movie.title} at {o.start_time.strftime('%Y-%m-%d %H:%M')}" for o in overlaps])
            raise ValidationError({'start_time': f"Overlaps with existing show(s) in this hall: {conflicts}"})
        
    def save(self, *args, **kwargs):
        self._ensure_seats_default()
        self.full_clean()
        super().save(*args, **kwargs)
        rows = ['A', 'B', 'C', 'D', 'E']
        for i, row in enumerate(rows):
            for col in range(1,11):
                if i*10 + col > self.seats_total:
                    break
                Seat.objects.create(
                    showtime=self,
                    seat_number=f"{row}{col}",
                    row=row,
                    column=col
                )




