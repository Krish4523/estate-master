# Generated by Django 5.1 on 2024-09-20 03:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0004_property_latitude_property_longitude_nearbyplace'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='property',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='property',
            name='longitude',
        ),
    ]
