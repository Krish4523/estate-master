from django.contrib import admin
from .models import User, OTP, Customer, Agent


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "role", "is_staff", "is_active")
    search_fields = ("email", "name", "phone", "role")
    list_filter = ("role", "is_staff", "is_active")
    ordering = ("name",)


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ("user", "otp", "created_at")
    search_fields = ("user__email", "otp")
    list_filter = ("created_at",)
    ordering = ("-created_at",)


admin.site.register(Customer)
admin.site.register(Agent)
