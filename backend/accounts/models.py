# import uuid
# from django.db import models
# from django.contrib.auth.models import BaseUserManager, AbstractUser, Group, Permission
# from django.utils import timezone
# import random
#
#
# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         """Create and return a regular user with an email and password."""
#         if not email:
#             raise ValueError('The Email field must be set')
#
#         email = self.normalize_email(email)
#         extra_fields.setdefault('is_active', False)
#         user = self.model(email=email, username=email, **extra_fields)  # Set username to email for regular users
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#
#     def create_superuser(self, username, password=None, **extra_fields):
#         """Create and return a superuser with a username and password."""
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#
#         if extra_fields.get('is_staff') is not True:
#             raise ValueError('Superuser must have is_staff=True.')
#         if extra_fields.get('is_superuser') is not True:
#             raise ValueError('Superuser must have is_superuser=True.')
#
#         return self.model.objects.create_user(username=username, password=password, **extra_fields)
#
#
# class User(AbstractUser):
#     ROLE_CHOICES = [
#         ('buyer', 'Buyer'),
#         ('seller', 'Seller'),
#         ('agent', 'Agent'),
#     ]
#
#     name = models.CharField(max_length=255, default="")
#     email = models.EmailField(max_length=255, unique=True)
#     phone = models.CharField(max_length=10, unique=True, default="")
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer', blank=False, null=False)
#
#     # Allow `username` to be optional, but it will be auto-set for regular users
#     username = models.CharField(max_length=150, unique=True, blank=True, null=True)
#
#     groups = models.ManyToManyField(Group, related_name='custom_user_set', blank=True)
#     user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set', blank=True)
#
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['name', 'password', 'phone', 'role']
#     objects = CustomUserManager()
#
#     def __str__(self):
#         return self.name
#
#
# class OTP(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     otp = models.CharField(max_length=6)
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def is_valid(self):
#         return timezone.now() < self.created_at + timezone.timedelta(minutes=10)
#
#     def generate_otp(self):
#         self.otp = f'{random.randint(100000, 999999):06}'
#         self.created_at = timezone.now()
#         self.save()
#         return self.otp
#
#
# # class CustomToken(models.Model):
# #     key = models.CharField(max_length=40, primary_key=True, default=uuid.uuid4)
# #     user = models.OneToOneField(User, related_name='auth_token', on_delete=models.CASCADE)
# #     created = models.DateTimeField(auto_now_add=True)
# #
# #     def save(self, *args, **kwargs):
# #         if not self.key:
# #             self.key = self.generate_key()
# #         return super().save(*args, **kwargs)
# #
# #     def generate_key(self):
# #         return uuid.uuid4().hex
# #
# #     def __str__(self):
# #         return self.key
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, Group, Permission
from django.utils import timezone
import random


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', False)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('agent', 'Agent'),
    ]

    name = models.CharField(max_length=255, default="")
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=10, unique=True, default="")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer', blank=False, null=False)

    # Allow `username` to be optional, but it will be auto-set for regular users
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    groups = models.ManyToManyField(Group, related_name='custom_user_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone', 'role']

    objects = CustomUserManager()

    def __str__(self):
        return self.name


class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() < self.created_at + timezone.timedelta(minutes=10)

    def generate_otp(self):
        self.otp = f'{random.randint(100000, 999999):06}'
        self.created_at = timezone.now()
        self.save()
        return self.otp
