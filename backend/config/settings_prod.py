from .settings import *

# 正式環境特定設定
DEBUG = False
DEVELOPMENT = False

# 不允許所有網域訪問 API
CORS_ALLOW_ALL_ORIGINS = True

# 允許的 CORS 來源（正式環境）
CORS_ALLOWED_ORIGINS = [
    "https://sonicvision.uno",
    "https://www.sonicvision.uno",
    "https://api.sonicvision.uno",
    "https://sonicvision-git-version5-peiyus-projects-d68d7d18.vercel.app",
    "https://sonicvision-zeta.vercel.app",
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
]

# 允許憑證
CORS_ALLOW_CREDENTIALS = True

# 允許的 CORS 來源模式
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.sonicvision\.uno$",
    r"^https://.*\.vercel\.app$",
]

# CSRF 設置
CSRF_TRUSTED_ORIGINS = [
    "https://sonicvision.uno",
    "https://www.sonicvision.uno",
    "https://api.sonicvision.uno",
    "https://sonicvision-git-version5-peiyus-projects-d68d7d18.vercel.app",
    "https://sonicvision-zeta.vercel.app",
]

# 資料庫設置
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

# 靜態文件設置
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    FRONTEND_DIR,
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
ALLOWED_HOSTS = [
    'sonicvision.uno',
    'www.sonicvision.uno',
    'api.sonicvision.uno',
] 