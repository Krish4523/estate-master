from django.contrib import admin
from .models import User, OTP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'is_staff', 'is_active')
    search_fields = ('email', 'name', 'phone', 'role')
    list_filter = ('role', 'is_staff', 'is_active')
    ordering = ('name',)


# @admin.register(CustomToken)
# class CustomTokenAdmin(admin.ModelAdmin):
#     list_display = ('key', 'user', 'created')
#     search_fields = ('user__email',)


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'created_at')
    search_fields = ('user__email', 'otp')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
