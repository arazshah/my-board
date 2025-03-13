from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# The API URLs are determined automatically by the router
# and additional endpoints are added manually
urlpatterns = [
    # Include the router generated URLs
    path('', include(router.urls)),

    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
]
