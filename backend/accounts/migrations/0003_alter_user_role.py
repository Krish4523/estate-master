# Generated by Django 5.1 on 2024-09-07 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_user_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('customer', 'Customer'), ('agent', 'Agent'), ('admin', 'Admin')], default='customer', max_length=20),
        ),
    ]
