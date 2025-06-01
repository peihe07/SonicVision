"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from api.consumers import MusicConsumer, ChatConsumer

# 根據環境變數選擇設定檔
settings_module = 'config.settings_prod' if os.getenv('DJANGO_ENV') == 'production' else 'config.settings_dev'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/music/', MusicConsumer.as_asgi()),
            path('ws/chat/', ChatConsumer.as_asgi()),
        ])
    ),
})
