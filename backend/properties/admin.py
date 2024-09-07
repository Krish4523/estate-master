from django.contrib import admin
from .models import Property, PropertyImage


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
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
        "seller",
        "agent",
        "is_verified",
        "is_sold",
    )
    search_fields = ("title", "local_address", "city", "state")
    list_filter = (
        "property_type",
        "is_verified",
        "is_sold",
        "sqft",
        "bedrooms",
        "parking",
    )
    ordering = ("listed_date",)


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ("property", "image")
    search_fields = ("property__title",)
    ordering = ("property",)
