from rest_framework import serializers

from showtime_service.models import ShowTime


class ShowtimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowTime
        fields = "__all__"
