from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('property', 'buyer', 'seller', 'agent', 'price', 'transaction_date',
                    'status', 'payment_method', 'agent_fee_from_buyer', 'agent_fee_from_seller')
    search_fields = ('property__title', 'buyer__username', 'seller__username', 'status')
    list_filter = ('transaction_date', 'status', 'payment_method')
    ordering = ('-transaction_date',)
