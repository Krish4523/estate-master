from django.db import models
from accounts.models import User


class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
        ("industrial", "Industrial"),
    ]

    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    local_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    sqft = models.IntegerField()
    bedrooms = models.IntegerField()
    parking = models.IntegerField()
    listed_date = models.DateTimeField(auto_now_add=True)

    is_verified = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)

    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="properties"
    )
    agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="agent_properties",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")

    def __str__(self):
        return f"Image for {self.property.title}"
