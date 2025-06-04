FROM python:3.11-slim

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    procps \
    && rm -rf /var/lib/apt/lists/*

# 複製依賴文件
COPY backend/requirements.txt .

# 安裝 Python 依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製後端代碼
COPY backend/ .

# 設置 Python 路徑
ENV PYTHONPATH=/app

# 創建必要的目錄
RUN mkdir -p /var/www/sonicvision/staticfiles \
    && mkdir -p /var/www/sonicvision/media \
    && mkdir -p /var/log/sonicvision \
    && mkdir -p /app/logs \
    && chmod -R 777 /var/log/sonicvision \
    && chmod 755 /app/logs

# 設置環境變量
ENV DJANGO_SETTINGS_MODULE=config.settings.production
ENV DJANGO_DEBUG=False
ENV DJANGO_ALLOWED_HOSTS=api.sonicvision.uno
ENV PYTHONUNBUFFERED=1

# 暴露端口
EXPOSE 8000

# 啟動命令
CMD ["gunicorn", "config.wsgi:application", "-c", "gunicorn.conf.py"]