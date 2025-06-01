import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class MusicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'music_{self.room_name}'

        # 加入房間組
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # 離開房間組
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        message = text_data_json.get('message')

        # 廣播消息到房間組
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'music_message',
                'message': message,
                'message_type': message_type
            }
        )

    async def music_message(self, event):
        message = event['message']
        message_type = event['message_type']

        # 發送消息到 WebSocket
        await self.send(text_data=json.dumps({
            'type': message_type,
            'message': message
        }))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope['user']

        # 加入房間組
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # 發送用戶加入通知
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'{self.user.username} 加入了聊天室',
                'username': 'System'
            }
        )

    async def disconnect(self, close_code):
        # 發送用戶離開通知
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'{self.user.username} 離開了聊天室',
                'username': 'System'
            }
        )

        # 離開房間組
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # 廣播消息到房間組
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': self.user.username
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # 發送消息到 WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        })) 