from .base import *

# 正式環境特定設定
DEBUG = False
DEVELOPMENT = False

# 不允許所有網域訪問 API
CORS_ALLOW_ALL_ORIGINS = False

# 允許的 CORS 來源（正式環境）
CORS_ALLOWED_ORIGINS = [
    "https://sonicvision.uno",
    "https://www.sonicvision.uno",
    "https://api.sonicvision.uno",
]

# 允許的 CORS 方法
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# 允許的 CORS 標頭
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'access-control-allow-origin',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-allow-credentials',
]

# 允許憑證
CORS_ALLOW_CREDENTIALS = True

# 允許的 CORS 來源模式
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.sonicvision\.uno$",
]

# CSRF 設置
CSRF_TRUSTED_ORIGINS = [
    "https://sonicvision.uno",
    "https://www.sonicvision.uno",
    "https://api.sonicvision.uno",
]

# 資料庫設置
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'postgres'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'postgres'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

# 靜態文件設置
STATIC_URL = '/static/'
STATIC_ROOT = '/var/www/sonicvision/staticfiles'
STATICFILES_DIRS = [
    BASE_DIR.parent / 'frontend' / 'dist',
]

# 使用 WhiteNoise 處理靜態文件
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# 安全性設置
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# 允許的主機
ALLOWED_HOSTS = ['*']

# 日誌設置
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/sonicvision/error.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

MEDIA_ROOT = '/var/www/sonicvision/media' 