from rest_framework import serializers
from properties.serializers import PropertySerializer
from accounts.serializers import CustomerSerializer
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    customer = CustomerSerializer()

    class Meta:
        model = Appointment
        fields = ["id", "property", "customer", "date", "description"]
