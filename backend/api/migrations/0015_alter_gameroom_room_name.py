# Generated by Django 5.1 on 2024-09-07 01:21

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_gameroom_room_name_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gameroom',
            name='room_name',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=128, unique=True),
        ),
    ]
