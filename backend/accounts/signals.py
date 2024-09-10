from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Customer, Agent


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == "customer":
            Customer.objects.create(user=instance)
        elif instance.role == "agent":
            Agent.objects.create(user=instance)
