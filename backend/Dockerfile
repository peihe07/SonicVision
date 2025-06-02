FROM python:3.11-slim

# 設置工作目錄
WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# 複製依賴文件
COPY requirements.txt .

# 安裝 Python 依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製項目文件
COPY . .

# 創建日誌目錄
RUN mkdir -p /var/log/sonicvision && \
    chmod 777 /var/log/sonicvision

# 設置環境變量
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# 暴露端口
EXPOSE 8000

# 啟動命令
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "--log-level", "debug", "--access-logfile", "/var/log/sonicvision/access.log", "--error-logfile", "/var/log/sonicvision/error.log", "--worker-class", "gunicorn.workers.sync.SyncWorker"] 