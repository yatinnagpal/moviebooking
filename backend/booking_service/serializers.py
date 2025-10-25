from rest_framework import serializers


from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    # Nested showtime info
    showtime_info = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "user_name",
            "user_email",
            "seats_booked",
            "status",
            "created_at",
            "showtime",
            "showtime_info",
        ]

    def get_showtime_info(self, obj):
        st = obj.showtime
        return {
            "id": st.id,
            "movie_title": st.movie.title if st.movie else "",
            "hall_name": st.hall_name,
            "start_time": st.start_time,
            "seats_total": st.seats_total,
            "seats_available": st.seats_available,
            "price_per_ticket": st.price_per_ticket,
        }
