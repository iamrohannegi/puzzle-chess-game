"""
ASGI config for backend project.
It exposes the ASGI callable as a module-level variable named ``application``.
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import environ

# Load environment variables from .env if it exists
env = environ.Env()
env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')

if os.path.exists(env_file):
    environ.Env.read_env(env_file)

# Set default Django settings module if not set
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Get the ASGI application
django_asgi_app = get_asgi_application()

# Now import routing and middleware after the application is ready
from api import routing
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack

# Define the ASGI application with routing for http and websocket
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
    ),
})