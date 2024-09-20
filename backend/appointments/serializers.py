from rest_framework import serializers
from properties.serializers import PropertySerializer
from accounts.serializers import CustomerSerializer
from properties.models import Property
from accounts.models import Customer
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    # property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    # customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    property = PropertySerializer()
    customer = CustomerSerializer()

    class Meta:
        model = Appointment
        fields = ["id", "property", "customer", "date", "description"]
