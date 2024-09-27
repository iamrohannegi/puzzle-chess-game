import random
from .models import *

from celery import shared_task 
import datetime
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import connection



# Gets a random puzzle from the database and sends it to the group
@shared_task
def send_random_puzzle(group, rating):
    room = GameRoom.objects.get(room_name=group)
    channel_layer = get_channel_layer()

    # Check if there's any winners
    members = room.members.all().select_related('profile').filter(profile__score__gte=room.target_score).order_by("-profile__score")
    if members: 
        room.in_progress = False
        room.save()

        # Update the games won by users who came 1st, 2nd, 3rd
        sorted_members = room.members.all().select_related('profile').order_by("-profile__score")

        position, prev_score = 1, sorted_members.first().profile.score
        for member in sorted_members:
            if member.profile.score < prev_score:
                position += 1
            if position > 3:
                break
            member.profile.increment_podium_finishes(position)
            print(f"Adding for member {member.username}, position: {position}")
    

        async_to_sync(channel_layer.group_send)(group, {"type": "finish_game"})
        return
    
    print("Back to send_random_puzzle")

    # Stop sending puzzles if the room is not in progress
    print("ROOM IN PROGRESS: ", room.in_progress)
    if not room.in_progress:
        return 

    

    # total_puzzles = Puzzle.objects.all().count();
    # all_puzzles = Puzzle.objects.filter(rating__lte=rating)
    # random_id = random.randint(1, total_puzzles)
    # random_puzzle = Puzzle.objects.get(id = random_id)

    
    random_puzzle = fetch_puzzle(rating)
    if not random_puzzle:
        return;

    while room.current_puzzle_lichess_id and room.current_puzzle_lichess_id == random_puzzle["lichess_puzzle"]:
        # random_id = random.randint(1, total_puzzles)
        # random_puzzle = Puzzle.objects.get(id = random_id)
        random_puzzle = fetch_puzzle(rating)
    
    finish_by = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds = 15)
    finish_by_str = finish_by.strftime(r'%Y-%m-%dT%H:%M:%SZ')
    data = { 
        "fen": random_puzzle["fen"], 
        "moves": random_puzzle["moves"], 
        "id": random_puzzle["lichess_puzzle"], 
        "finishBy": finish_by_str 
    }
    print("PUZZLE ID: ",data["id"])
    
    event = {
        "type": "send_puzzle",
        "puzzle": data,
    }
    
    print(group)
    async_to_sync(channel_layer.group_send)(group, event)
    send_random_puzzle.apply_async((group, rating), countdown=15.0)
    # send_random_puzzle.apply_async((group), countdown=5.0)

def fetch_puzzle(rating): 
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT * FROM api_puzzle
            WHERE rating <= %s
            ORDER BY RANDOM()
            LIMIT 1
        """, [rating])

        row = cursor.fetchone()
    
    if row: 
        return { 'id': row[0], 'fen': row[1], 'moves': row[2], 'lichess_puzzle': row[3], 'rating': row[4]}

    return None