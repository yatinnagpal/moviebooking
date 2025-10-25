from rest_framework import status, viewsets
from rest_framework.response import Response

from showtime_service.models import ShowTime

from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        print("request.data", request.data)
        showtime_id = request.data.get("showtime")
        seats_to_book = request.data.get("seats_booked")
        user_name = request.data.get("user_name")
        user_email = request.data.get("user_email")

        # Convert to integer safely
        try:
            seats_to_book = int(seats_to_book)
        except (TypeError, ValueError):
            return Response({"error": "Invalid number of seats"}, status=400)

        if seats_to_book <= 0:
            return Response({"error": "Number of seats must be > 0"}, status=400)

        try:
            showtime = ShowTime.objects.get(id=showtime_id)
        except ShowTime.DoesNotExist:
            return Response(
                {"error": "Showtime not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if seats_to_book > showtime.seats_available:
            return Response({"error": "Not enough seats available"}, status=400)

        booking = Booking.objects.create(
            showtime=showtime,
            user_name=user_name,
            user_email=user_email,
            seats_booked=seats_to_book,
            status="confirmed",
        )
        showtime.seats_available -= seats_to_book
        showtime.save(update_fields=["seats_available"])

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
