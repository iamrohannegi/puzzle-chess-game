# Generated by Django 5.1 on 2024-09-06 02:52

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_gameroom_current_puzzle_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gameroom',
            old_name='current_puzzle_id',
            new_name='current_puzzle_lichess_id',
        ),
        migrations.AlterField(
            model_name='gameroom',
            name='room_name',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=128, unique=True),
        ),
    ]
