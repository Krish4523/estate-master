from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('property', 'buyer', 'date', 'confirmed')
    search_fields = ('property__title', 'buyer__username')
    list_filter = ('date', 'confirmed')
    ordering = ('-date',)
