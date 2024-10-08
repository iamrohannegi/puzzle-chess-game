# Generated by Django 5.1 on 2024-09-11 19:04

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_alter_gameroom_room_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='gameroom',
            name='score_to_give',
            field=models.IntegerField(default=10),
        ),
        migrations.AddField(
            model_name='gameroom',
            name='target_score',
            field=models.IntegerField(default=100),
        ),
        migrations.AlterField(
            model_name='gameroom',
            name='room_name',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=128, unique=True),
        ),
    ]
