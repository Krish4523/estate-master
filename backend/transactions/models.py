from django.db import models
from accounts.models import User
from properties.models import Property


# Transaction Model
class Transaction(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('cheque', 'Cheque'),
    ]
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='transactions')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_transactions')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seller_transactions')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='agent_transactions', null=True, blank=True)

    price = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20)  # pending, successful, failed
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='cash')

    # Agent fees
    agent_fee_from_buyer = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    agent_fee_from_seller = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Transaction for {self.property.title} - {self.status}"

    def is_cash_payment(self):
        return self.payment_method == 'cash'

    def is_card_payment(self):
        return self.payment_method == 'card'

    def is_cheque_payment(self):
        return self.payment_method == 'cheque'
