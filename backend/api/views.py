from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
from .models import *

import random

def room_view(request, room_name="public-room"):
    permission_classes = [IsAuthenticated]
    game_room = get_object_or_404(GameRoom, room_name=room_name)
    
    return Response({"name": game_room.room_name})

# Create your views here.
def random_puzzle(request):
    total_puzzles = Puzzle.objects.all().count()
    random_id = random.randint(1, total_puzzles) 
    random_puzzle = Puzzle.objects.get(id = random_id)
    data = { "fen": random_puzzle.fen, "moves": random_puzzle.moves, "id": random_puzzle.lichess_puzzle }
    return JsonResponse(data)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
