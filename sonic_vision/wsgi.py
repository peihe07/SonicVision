from dotenv import load_dotenv
import os

from django.core.wsgi import get_wsgi_application

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sonic_vision.settings')

application = get_wsgi_application()
