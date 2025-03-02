from pathlib import Path
import os
import environ
from dotenv import load_dotenv

load_dotenv()

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

BASE_DIR = Path(__file__).resolve().parent.parent

# 允許所有前端連接（測試用，正式環境請修改）
CORS_ALLOW_ALL_ORIGINS = True  # 設為 True 允許所有來源

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

env =environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# 資料庫設定
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB', default='sonicvision_db'),
        'USER': env('POSTGRES_USER', default='sonicvision_user'),
        'PASSWORD': env('POSTGRES_PASSWORD', default='your_secure_password'),
        'HOST': env('POSTGRES_HOST', default='db'),
        'PORT': env('POSTGRES_PORT', default='5432'),
    }
}


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

FRONTEND_DIST = os.path.join(BASE_DIR, "sonic-vision-frontend", "dist")
if os.path.exists(FRONTEND_DIST):  # 只有當 dist 存在時才加入
    STATICFILES_DIRS = [FRONTEND_DIST]
else:
    STATICFILES_DIRS = []

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # DRF API 支援
    'rest_framework_simplejwt',
    'corsheaders',  # 添加 CORS 支援
    'channels',  # WebSocket 支援
    'main_app',
    'music',
    'movies',
    'users',
    'reviews',
    'playlists',
    'recommendations',
    'chat',
]

LANGUAGE_CODE = 'en-us'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
MIDDLEWARE.insert(0, "corsheaders.middleware.CorsMiddleware")

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

ROOT_URLCONF = 'sonic_vision.urls'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&5w(!f$@lh=y(#oq_-&)ey%zhm=$^4nrn7@nir=^tu4%i54q+8'

# 讀取 Spotify API 金鑰
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
    raise ValueError("SPOTIFY_CLIENT_ID 或 SPOTIFY_CLIENT_SECRET 未正確載入！")
SPOTIFY_REDIRECT_URI = "http://127.0.0.1:8000/callback/"

STATIC_URL = "/static/"
# 🔹 讓 Django 找到 Vue build 出來的靜態文件
STATICFILES_DIRS = [
    FRONTEND_DIST,  # ✅ 確保 Django 能找到 Vue build 出來的檔案
]

# 🔹 讓 Django 伺服靜態文件（生產環境可能要用 Nginx）
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [FRONTEND_DIST],  # ✅ 確保 Django 能找到 Vue 的 index.html
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sonic_vision.wsgi.application'









TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True




