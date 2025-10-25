from django.core.exceptions import ValidationError
from rest_framework import status, viewsets
from rest_framework.response import Response

from showtime_service.models import ShowTime
from showtime_service.serializers import ShowtimeSerializer


class ShowtimeViewSet(viewsets.ModelViewSet):
    serializer_class = ShowtimeSerializer

    def get_queryset(self):
        queryset = ShowTime.objects.all()
        movie_id = self.request.query_params.get("movie_id")
        if movie_id is not None:
            queryset = queryset.filter(movie_id=movie_id)
        return queryset.order_by("start_time")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=False)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_create(serializer)
        except ValidationError as e:
            error_data = (
                e.message_dict if hasattr(e, "message_dict") else {"error": e.messages}
            )
            return Response(error_data, status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
