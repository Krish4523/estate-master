from django.db import models
from accounts.models import User
from properties.models import Property


# Appointment Model
class Appointment(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="appointments"
    )
    buyer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="appointments"
    )
    date = models.DateTimeField()
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"Appointment on {self.date} for {self.property.title}"
