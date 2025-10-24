from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Booking, Seat
from .serializers import BookingSerializer, SeatSerializer
from django.utils import timezone
from django.shortcuts import render

# Create your views here.

class SeatsViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

    def lock_seat(self, request, pk=None):
        seat = self.get_object()
        if seat.is_booked:
            return Response({'error': 'Seat is already booked'}, status=status.HTTP_400_BAD_REQUEST)
        
        seat.is_locked = True
        seat.locked_at = timezone.now()
        seat.save()

        return Response(SeatSerializer(seat).data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        showtime_id = request.data.get('showtime')
        seat_ids = request.data.get('seat_ids', [])
        user_name = request.data.get('user_name')
        user_email = request.data.get('user_email')

        seats = Seat.objects.filter(id__in=seat_ids, is_booked=False)
        if not seats.exists():
            return Response({'error': 'No valid seats available'}, status=status.HTTP_400_BAD_REQUEST)
        
        for seat in seats:
            seat.is_booked = True
            seat.is_locked = False
            seat.locked_at = timezone.now()
            seat.save()

        booking = Booking.objects.create(
            showtime_id=showtime_id,
            user_name=user_name,
            user_email=user_email,
            status='confirmed'
        )
        booking.seats.set(seats)
        booking.save()

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


