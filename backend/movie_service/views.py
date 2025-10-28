from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Movie
from .serializers import MovieSerializer


# List + Create
class MovieListCreateView(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save()


    def get_queryset(self):
        # Everyone (admin or normal user) can see all movies
        return Movie.objects.all()


class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
