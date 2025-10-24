from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeatsViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'seats', SeatsViewSet, basename='seats')
router.register(r'bookings', BookingViewSet, basename='bookings')

urlpatterns = [
    path('', include(router.urls)),
]
