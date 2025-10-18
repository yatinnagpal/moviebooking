from rest_framework import viewsets
from showtime_service.models import ShowTime
from showtime_service.seriallizers import ShowtimeSerializer

class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = ShowTime.objects.all()
    serializer_class = ShowtimeSerializer