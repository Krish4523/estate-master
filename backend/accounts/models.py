from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, Group, Permission
from django.utils import timezone
from properties.models import Property
import random


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", False)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ("customer", "Customer"),
        ("agent", "Agent"),
        ("admin", "Admin"),
    ]

    name = models.CharField(max_length=255, default="")
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=10, unique=True, default="")
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default="customer", blank=False, null=False
    )

    # Allow `username` to be optional, but it will be auto-set for regular users
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    groups = models.ManyToManyField(Group, related_name="custom_user_set", blank=True)
    user_permissions = models.ManyToManyField(
        Permission, related_name="custom_user_set", blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone", "role"]

    objects = CustomUserManager()

    def __str__(self):
        return self.name


class Customer(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="customer_profile"
    )
    own_properties = models.ManyToManyField(
        Property, related_name="owned_by_customers", blank=True
    )
    fav_properties = models.ManyToManyField(
        Property, related_name="favorited_by_customers", blank=True
    )

    def __str__(self):
        return f"Customer: {self.user.name}"


class Agent(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="agent_profile"
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    # Properties that are actively listed by the agent
    active_listings = models.ManyToManyField(
        Property, related_name="listed_by_agent", blank=True
    )

    # Properties where inquiries have been made by the agent
    inquiry_listings = models.ManyToManyField(
        Property, related_name="inquired_by_agents", blank=True
    )

    def __str__(self):
        return f"Agent: {self.user.name}, Rating: {self.rating}"


class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() < self.created_at + timezone.timedelta(minutes=10)

    def generate_otp(self):
        self.otp = f"{random.randint(100000, 999999):06}"
        self.created_at = timezone.now()
        self.save()
        return self.otp
