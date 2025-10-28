from rest_framework import serializers
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'description',
            'genre',
            'duration',
            'rating',
            'poster_url',
            'release_date',
            'created_at',
        ]
        read_only_fields = ['created_at']

    def create(self, validated_data):
        return super().create(validated_data)
