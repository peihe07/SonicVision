# 1️⃣ 使用 Python 官方映像檔
FROM python:3.10

# 2️⃣ 設定工作目錄
WORKDIR /app

# 3️⃣ 複製並安裝 Python 依賴
# **先複製 `requirements.txt`，避免 Docker 快取失效**
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 4️⃣ 安裝 Node.js 和 npm（用於前端建置）
RUN apt-get update && apt-get install -y nodejs npm

# 5️⃣ 複製所有專案檔案
COPY . /app/

# 6️⃣ 進入前端目錄並執行 npm build
WORKDIR /app/sonic-vision-frontend
RUN npm install && npm run build

# 7️⃣ 切換回 Django 目錄
WORKDIR /app

# 8️⃣ 運行 Django migrate & collectstatic
RUN python manage.py migrate && python manage.py collectstatic --noinput

# 9️⃣ 啟動 Gunicorn
CMD ["gunicorn", "sonic_vision.wsgi:application", "--bind", "0.0.0.0:8000"]