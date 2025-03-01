from dotenv import load_dotenv
import os

load_dotenv()

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sonic_vision.settings')

application = get_asgi_application()
