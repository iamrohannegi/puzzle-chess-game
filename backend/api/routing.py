from django.urls import path
from .consumers import *

websocket_urlpatterns = [
    path("ws/gameroom/<gameroom_name>", GameRoomConsumer.as_asgi()),    
    path("ws/lobby", LobbyConsumer.as_asgi()),
]
