import os
from django.core.wsgi import get_wsgi_application

# 根據環境變數選擇設定檔
settings_module = 'config.settings_prod' if os.getenv('DJANGO_ENV') == 'production' else 'config.settings_dev'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
