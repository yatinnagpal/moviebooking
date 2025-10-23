from rest_framework import viewsets
from showtime_service.models import ShowTime
from showtime_service.seriallizers import ShowtimeSerializer

class ShowtimeViewSet(viewsets.ModelViewSet):
    serializer_class = ShowtimeSerializer
    
    def get_queryset(self):
        queryset = ShowTime.objects.all()
        movie_id = self.request.query_params.get('movie')
        if movie_id is not None:
            queryset = queryset.filter(movie=movie_id)
        return queryset.order_by('start_time')



        
    