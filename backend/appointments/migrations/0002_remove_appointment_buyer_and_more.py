# Generated by Django 5.1 on 2024-09-14 06:28

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_agent_customer"),
        ("appointments", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="appointment",
            name="buyer",
        ),
        migrations.RemoveField(
            model_name="appointment",
            name="confirmed",
        ),
        migrations.AddField(
            model_name="appointment",
            name="customer",
            field=models.ForeignKey(
                default=8,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="appointments",
                to="accounts.customer",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appointment",
            name="description",
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name="appointment",
            name="date",
            field=models.DateField(),
        ),
    ]
