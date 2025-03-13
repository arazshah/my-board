from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model that extends Django's AbstractUser"""
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(
        upload_to='profile_images/', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    # Add additional fields as needed
    phone_number = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)

    # Required for custom user model
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
