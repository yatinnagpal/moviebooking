from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from movie_service.models import Movie
from booking_service.models import Booking
from showtime_service.models import ShowTime
from django.db.models import Sum, F

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    # 🧮 Total users (excluding admin)
    users_enrolled = User.objects.filter(is_superuser=False).count()

    # 🎬 Total movies in the system
    total_movies = Movie.objects.count()

    # 🎟️ Total bookings
    total_bookings = Booking.objects.count()

    # 💰 Dynamic revenue based on ShowTime.price_per_ticket
    total_revenue = (
        Booking.objects
        .filter(status='confirmed')
        .aggregate(
            total=Sum(F('seats_booked') * F('showtime__price_per_ticket'))
        )['total'] or 0
    )

    data = {
        "totalBookings": total_bookings,
        "usersEnrolled": users_enrolled,
        "totalMovies": total_movies,
        "revenue": total_revenue,
    }
    return Response(data)
