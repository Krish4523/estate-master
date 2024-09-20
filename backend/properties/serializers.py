from rest_framework import serializers
from .models import Property, PropertyImage, NearbyPlace


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image"]


class NearbyPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyPlace
        fields = ["name", "distance", "place_type"]


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, required=False)
    nearby_places = NearbyPlaceSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "price",
            "description",
            "property_type",
            "local_address",
            "city",
            "state",
            "pincode",
            "bedrooms",
            "parking",
            "sqft",
            "images",
            "is_verified",
            "is_sold",
            "agent",
            "seller",
            "nearby_places",
        ]

    def create(self, validated_data):
        # images_data = validated_data.pop("images", None)
        # print(validated_data)
        property_instance = Property.objects.create(**validated_data)
        return property_instance

    def update(self, instance, validated_data):
        # Extract images data from validated_data if present
        images_data = validated_data.pop("images", None)

        # Update property instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # if images_data:
        #     # Optionally: Clear old images before adding new ones
        #     PropertyImage.objects.filter(property=instance).delete()
        #
        #     for image_data in images_data[:4]:  # Limit to 4 images
        #         PropertyImage.objects.create(property=instance, **image_data)
        return instance
