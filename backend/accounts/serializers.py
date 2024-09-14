from rest_framework import serializers
from properties.serializers import PropertySerializer
from .models import User, Customer, Agent


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "password", "phone", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    own_properties = PropertySerializer(many=True, read_only=True)
    fav_properties = PropertySerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ["user", "own_properties", "fav_properties"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data)
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()
        return super().update(instance, validated_data)


class AgentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    active_listings = PropertySerializer(many=True, read_only=True)
    inquiry_listings = PropertySerializer(many=True, read_only=True)

    class Meta:
        model = Agent
        fields = ["user", "rating", "active_listings", "inquiry_listings"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        agent = Agent.objects.create(user=user, **validated_data)
        return agent

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data)
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()
        return super().update(instance, validated_data)


# class AgentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["id", "name", "email"]
