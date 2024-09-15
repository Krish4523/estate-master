from django.db import models
from accounts.models import User, Customer
from properties.models import Property


# Appointment Model
class Appointment(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="appointments"
    )
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="appointments", null=True
    )
    date = models.DateField()
    description = models.TextField(null=True)

    def __str__(self):
        return (
            f"Appointment on {self.date} for {self.property.title} by {self.customer}"
        )
