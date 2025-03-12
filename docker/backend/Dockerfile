FROM python:3.10-slim

WORKDIR /app

# 設置 Python 環境變數
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 安裝依賴
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 安裝 Python 依賴
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 複製項目
COPY backend/ /app/

# 開放端口
EXPOSE 8000

# 啟動命令
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]