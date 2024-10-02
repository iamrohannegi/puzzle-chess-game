# Puzzle Royale

Puzzle Royale is a multiplayer chess puzzle game where players compete to solve chess puzzles in real-time. The game integrates a variety of tech to create an exciting, seamless experience:

## Features:

- Real-time multiplayer lobbies with chat functionality using Django Channels and WebSockets.
- Dynamic puzzle solving – puzzles are sent every 15 seconds, and players earn points based on how fast they solve each one.
- Celery orchestrates background tasks, sending puzzles, tracking scores, and managing game resets.
- JWT-based authentication with React.js on the front end for smooth, secure user experiences.
- Over 10,000 Lichess puzzles stored in a PostgreSQL database for endless variety!
- Redis handles communication between Django Channels and Celery for efficient real-time updates.

**Try it on**: www.puzzleroyale.xyz

## Check out the demo below!

[![Puzzle Royale Gameplay](https://img.youtube.com/vi/9hQBCZIzydA/0.jpg)](https://www.youtube.com/watch?v=9hQBCZIzydA)

## Screenshots

![image](https://github.com/user-attachments/assets/fd539f5b-be76-4363-bb8b-792ae0618ab3)
![image](https://github.com/user-attachments/assets/2f84173a-8250-40c6-986c-5f1c7298b1f6)
![image](https://github.com/user-attachments/assets/a8439547-2fa2-4b9b-9501-2808272f5f24)
![image](https://github.com/user-attachments/assets/2062f945-8d06-4d8a-9105-cca3f14c7712)
![image](https://github.com/user-attachments/assets/064e2b73-a609-43ce-9747-a508e90d857a)

