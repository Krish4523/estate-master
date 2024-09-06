from rest_framework import serializers
from .models import Property


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "title",
            "description",
            "property_type",
            "price",
            "local_address",
            "city",
            "state",
            "pincode",
            "sqft",
            "bedrooms",
            "parking",
            "listed_date",
            "is_available",
            "seller",
            "agent",
        ]
