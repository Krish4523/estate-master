# Generated by Django 5.1 on 2024-09-21 06:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0005_remove_property_latitude_remove_property_longitude'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='document_name',
            field=models.CharField(blank=True, null=True),
        ),
    ]