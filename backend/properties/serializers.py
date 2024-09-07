from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image"]


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, required=False)

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
            "is_verified",
            "is_sold",
            "seller",
            "agent",
            "images",
        ]

    def create(self, validated_data):
        # images_data = validated_data.pop("images", None)
        property_instance = Property.objects.create(**validated_data)
        print(validated_data)
        # Handle images
        # if images_data:
        #     print(images_data)
        #     for image_data in images_data[:4]:
        #         PropertyImage.objects.create(property=property_instance, **image_data)

        return property_instance

    def update(self, instance, validated_data):
        # Extract images data from validated_data if present
        images_data = validated_data.pop("images", None)

        # Update property instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if images_data:
            # Optionally: Clear old images before adding new ones
            PropertyImage.objects.filter(property=instance).delete()

            for image_data in images_data[:4]:  # Limit to 4 images
                PropertyImage.objects.create(property=instance, **image_data)

        return instance
