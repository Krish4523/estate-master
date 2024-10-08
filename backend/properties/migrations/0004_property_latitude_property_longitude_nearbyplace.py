# Generated by Django 5.1 on 2024-09-10 05:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0003_remove_property_is_available_property_is_sold_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.CreateModel(
            name='NearbyPlace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('distance', models.DecimalField(decimal_places=2, help_text='Distance in kilometers', max_digits=5)),
                ('place_type', models.CharField(max_length=50)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='nearby_places', to='properties.property')),
            ],
        ),
    ]
