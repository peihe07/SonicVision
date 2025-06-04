from .settings import *

# 開發環境特定設定
DEBUG = True
DEVELOPMENT = True

# 允許所有網域訪問 API（開發模式用）
CORS_ALLOW_ALL_ORIGINS = True

# 允許的 CORS 來源
CORS_ALLOWED_ORIGINS = [
    "https://localhost:8000",
    "https://127.0.0.1:8000",
    "https://localhost:8080",
    "https://127.0.0.1:8080",
    "https://localhost:5173",
    "https://127.0.0.1:5173",
    "https://localhost:8083",
    "https://127.0.0.1:8083",
]

# CSRF 設置
CSRF_TRUSTED_ORIGINS = [
    "https://localhost:8000",
    "https://127.0.0.1:8000",
    "https://localhost:8080",
    "https://127.0.0.1:8080",
    "https://localhost:5173",
    "https://127.0.0.1:5173",
    "https://localhost:8083",
    "https://127.0.0.1:8083",
]

# 資料庫設置
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'sonicvision'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'postgres'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# 靜態文件設置
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    FRONTEND_DIR,
]

# 不使用 WhiteNoise
MIDDLEWARE.remove('whitenoise.middleware.WhiteNoiseMiddleware')

# 添加 django-extensions 到 INSTALLED_APPS
INSTALLED_APPS += ['django_extensions']

# SSL/HTTPS 設置
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True 