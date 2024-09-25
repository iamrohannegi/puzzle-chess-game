from django.db import models
from django.contrib.auth.models import User
import shortuuid 

# Create your models here.
class Puzzle(models.Model):
    fen = models.CharField(max_length=200)
    moves = models.CharField(max_length = 200)
    lichess_puzzle = models.CharField(max_length=100)
    rating = models.IntegerField(default=1000)

    def __str__(self):
        return f'${self.fen}'

class GameRoom(models.Model):
    room_name = models.CharField(max_length=128, unique=True, default = shortuuid.uuid)
    roomchat_name = models.CharField(max_length=128, null=True, blank=True)
    admin = models.ForeignKey(User, related_name='gamerooms', blank=True, null=True, on_delete=models.SET_NULL)
    members = models.ManyToManyField(User, related_name="online_in_room", blank=True)
    is_private = models.BooleanField(default=False)
    current_puzzle_lichess_id = models.CharField(max_length=100, null=True)
    in_progress = models.BooleanField(default=False)
    score_to_give = models.IntegerField(default=10)
    target_score = models.IntegerField(default=100)

    def __str__(self):
        return self.room_name


# Creating Profiles for every user to hold additional information
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    score = models.IntegerField(default=0)
    in_game = models.BooleanField(default=False)
    games_played = models.IntegerField(default=0)
    got_first = models.IntegerField(default=0)
    got_second = models.IntegerField(default=0)
    got_third = models.IntegerField(default=0)
    
    def __str__(self):
        return self.user.username

    def joined_game(self):
        self.score = 0
        self.in_game = True
        self.save() 

    def left_game(self):
        self.score = 0
        self.in_game = False
        self.save() 

    def update_score_by(self, val):
        self.score += val
        self.save()

    def increment_games_played(self):
        self.games_played += 1
        self.save()

    def increment_podium_finishes(self, position_num):
        if position_num == 1:
            self.got_first += 1
        elif position_num == 2:
            self.got_second += 1
        elif position_num == 3:
            self.got_third += 1
        else:
            return 
        self.save()

    def reset_score(self):
        self.score = 0 
        self.save()