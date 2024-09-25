# Generated by Django 5.1 on 2024-09-19 23:57

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_puzzle_rating_alter_gameroom_room_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gameroom',
            name='room_name',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=128, unique=True),
        ),
        migrations.AlterField(
            model_name='gameroom',
            name='target_score',
            field=models.IntegerField(default=100),
        ),
    ]
