from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookingViewSet

router = DefaultRouter()
router.register(r"bookings", BookingViewSet, basename="bookings")

urlpatterns = [
    path("", include(router.urls)),
]
