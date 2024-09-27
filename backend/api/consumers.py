from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from django.http import Http404
from channels.exceptions import StopConsumer

from django.template.loader import render_to_string
from asgiref.sync import async_to_sync 
from .models import *
from .tasks import send_random_puzzle
import json, random

class GameRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        print(self.user)
        self.gameroom_name = self.scope['url_route']['kwargs']['gameroom_name']
        print("---------")
        print(self.gameroom_name)
        print("---------")

        self.gameroom = None

        try:
            self.gameroom = get_object_or_404(GameRoom, room_name=self.gameroom_name)
        except Http404:
            self.accept()
            self.send(text_data=json.dumps({ "type": "game_not_found" }))
            self.close()
            return ""



            
        async_to_sync(self.channel_layer.group_add)(
            self.gameroom_name, self.channel_name
        )


        # Update members
        if self.user not in self.gameroom.members.all():
            self.gameroom.members.add(self.user)
            self.user.profile.joined_game()
            self.update_online_count()

        self.accept()
        self.send_username()
        self.send_roomname()

        # Send puzzle to the user if the game is in progress
        if self.gameroom.in_progress and self.gameroom.current_puzzle_lichess_id:
            print('Current puzzle id: ', self.gameroom.current_puzzle_lichess_id)
            current_puzzle = Puzzle.objects.get(lichess_puzzle=self.gameroom.current_puzzle_lichess_id)
            data = { "fen": current_puzzle.fen, "moves": current_puzzle.moves, "id": current_puzzle.lichess_puzzle }
            context = { "type": "puzzle", "puzzle": data}
            self.send(text_data=json.dumps(context))
            self.user.profile.increment_games_played()
            self.user.refresh_from_db()
        
        # self.gameroom = get_object_or_404(Game)
    
        
    def disconnect(self, close_code):
        self.user.refresh_from_db()
        print("JUST ENTERING THE DISCONNECT PART")
        print(f"USERS STARS: {self.user.profile.got_first} firsts, {self.user.profile.got_second} seconds, {self.user.profile.got_third} thirds")
        async_to_sync(self.channel_layer.group_discard)(
            self.gameroom_name, self.channel_name
        )

        if self.gameroom and self.user in self.gameroom.members.all():
            self.gameroom.members.remove(self.user)
            self.user.profile.left_game()

            if self.gameroom.members.all().count() == 0:
                self.gameroom.delete()
                return

            # If the user who disconnected was a admin, choose a random admin
            if self.user == self.gameroom.admin: 
                members = list(self.gameroom.members.all())
                if members:
                    random_member = random.choice(members)
                    self.gameroom.admin = random_member
                    new_room_name = f'{random_member.username}\'s Room'
                    self.gameroom.roomchat_name = new_room_name
                    self.gameroom.save() 
                    self.send_refresh_game_obj()
                    self.send_updated_room_name(new_room_name)
            self.update_online_count()
        
        print("END OF DISCONNECT")
        print(f"USERS STARS: {self.user.profile.got_first} firsts, {self.user.profile.got_second} seconds, {self.user.profile.got_third} thirds")
        raise StopConsumer()

    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text_data_type = text_data_json['type']
        

        print("Message recieved by: ", self.user)
        print("Current admin: ", self.gameroom.admin)
        
        # If it's a chat message, group send it to the game room
        if text_data_type == "chat": 
            senders_name = self.user.username
            encoded_message = f'{len(senders_name)}#{senders_name}{text_data_json["body"]}'
            event = {
                'type': 'message_handler',
                'message': encoded_message,
            }

            async_to_sync(self.channel_layer.group_send)(
                self.gameroom_name, event
            )

        elif text_data_type == "start_game" and self.user == self.gameroom.admin:
            self.reset_members_score()
            self.update_members_game_played()
            self.gameroom.in_progress = True
            self.gameroom.save()
            self.send_refresh_game_obj()
            send_random_puzzle.delay(self.gameroom_name, int(text_data_json["rating"]))

        elif text_data_type == "stop_game":
            self.gameroom.in_progress = False
            self.gameroom.save()
            self.send_refresh_game_obj()

        elif text_data_type == "update_score":
            self.gameroom.refresh_from_db()
            current_point = self.gameroom.score_to_give
            self.user.refresh_from_db()
            self.user.profile.update_score_by(current_point)
            if current_point > 1:
                self.update_gameroom_score_to_give(current_point - 1)
            self.update_online_count()

    def message_handler(self, event):            
        context = {
            'type': 'messages',
            'message': event["message"]
        }
        self.send(text_data=json.dumps(context))

    def send_puzzle(self, event):
        print("I'm in the send puzzle function haha")
        self.gameroom.current_puzzle_lichess_id = event["puzzle"]["id"]
        self.update_gameroom_score_to_give(self.gameroom._meta.get_field("score_to_give").default)

        print("Current puzzle", self.gameroom.current_puzzle_lichess_id)
        context = {
            'type': 'puzzle',
            'puzzle': event["puzzle"]
        }
        self.send(text_data=json.dumps(context))
        
    def update_online_count(self):
        members_qs = self.gameroom.members.all().select_related('profile').order_by("-profile__score")
        print(members_qs)
        members = [{ 'name': member.username, 'isAdmin': member == self.gameroom.admin, 'score': member.profile.score } for member in members_qs]
        event = {
            "type": "online_count_handler",
            "members": members
        }
        async_to_sync(self.channel_layer.group_send)(self.gameroom_name, event)

    def online_count_handler(self, event):
        message = {
            'type': 'members',
            'members': event['members']
        }
        self.send(text_data=json.dumps(message))

    def send_refresh_game_obj(self):
        async_to_sync(self.channel_layer.group_send)(
            self.gameroom_name, {'type': 'refresh_gameroom_obj'}
        )
    
    def refresh_gameroom_obj(self, event={}):
        self.gameroom.refresh_from_db()

    def update_gameroom_score_to_give(self, val):
        self.gameroom.score_to_give = val
        self.gameroom.save()

    def finish_game(self, event):
        self.refresh_gameroom_obj()
        self.send(text_data=json.dumps({"type": "win_screen"}))

    def reset_members_score(self):
        for member in self.gameroom.members.all():
            member.profile.reset_score()
            member.profile.save()
        
        self.send_refresh_game_obj()
        self.update_online_count()

    def update_members_game_played(self):
        for member in self.gameroom.members.all():
            member.profile.increment_games_played()
            member.profile.save()

        self.send_refresh_game_obj()

    def send_updated_room_name(self, roomname):
        async_to_sync(self.channel_layer.group_send)(
            self.gameroom_name, {'type': 'send_roomname', 'roomname': roomname}
        )

    def send_roomname(self, event={}):
        roomname = event["roomname"] if event else self.gameroom.roomchat_name
        self.send(text_data=json.dumps({'type': 'roomname', 'name': roomname}))

    def send_username(self):
        self.send(text_data=json.dumps({'type': 'username', 'name': self.user.username}))

    



class LobbyConsumer(WebsocketConsumer):
    def connect(self):        
        self.user = self.scope['user']
        self.group_name = "lobby"

        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name
        )
        self.accept()
        self.send_user_info()
        self.send_game_rooms()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )
        raise StopConsumer()

        
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        # If a user sends a create_game message, send him the name of the 
        # game room created.

        new_room = None
        if (text_data_json["type"] == "create_game"):
            is_private = text_data_json["isPrivate"]
            print("NEW GAME CREATED!!!!!")
            new_room = GameRoom.objects.create(roomchat_name = f"{self.user.username}'s Room", admin=self.user, is_private=is_private)
        elif (text_data_json["type"] == "refresh_lobby"):
            self.send_game_rooms()

        # Send current live game rooms to everyone still connected to lobby
        event = {
            "type": "send_game_rooms",
        }
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, event
        )

        if (text_data_json["type"] == "create_game"):
            self.send(text_data=json.dumps({"type": "new_game", "room_name": new_room.room_name}))
    
    def send_user_info(self):
        user_data = {
            "name": self.user.username,
            "total_games": self.user.profile.games_played,
            "first_place": self.user.profile.got_first,
            "second_place": self.user.profile.got_second,
            "third_place": self.user.profile.got_third,
        }
        self.send(text_data=json.dumps({'type': 'user_info', 'data': user_data}))

    def send_game_rooms(self, event={}):
        rooms = GameRoom.objects.filter(is_private=False).all()
        rooms_info = [] 
        for r in rooms:
            data = { 
                "link": r.room_name,
                "name": r.roomchat_name,
                "members_count": r.members.all().count(),
            }
            rooms_info.append(data)
        self.send(text_data=json.dumps({"type": "rooms", "rooms": rooms_info}))