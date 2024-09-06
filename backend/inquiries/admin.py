from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('property', 'buyer', 'message', 'created_at')
    search_fields = ('property__title', 'buyer__username', 'message')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
