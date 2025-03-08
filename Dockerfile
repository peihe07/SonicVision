# 1️⃣ 使用輕量 Python 官方映像檔
FROM python:3.10-slim AS backend

# 2️⃣ 設定工作目錄
WORKDIR /app

# 3️⃣ 安裝系統相依套件
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 4️⃣ 複製 `requirements.txt` 並安裝 Python 依賴（利用 Docker Cache）
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ 建立前端建置階段（多階段建置）
FROM node:20 AS frontend

WORKDIR /app/frontend
COPY sonic-vision-frontend /app/frontend

# 6️⃣ 安裝前端依賴並執行建置
RUN npm install && npm run build

# 7️⃣ 回到 Python 容器，複製前端 `dist`
FROM backend

# 8️⃣ 複製 Django 檔案（避免快取失效）
COPY . /app/
COPY --from=frontend /app/frontend/dist /app/sonic-vision-frontend/dist

# 9️⃣ 運行 Django migrate & collectstatic
RUN sh -c "until pg_isready -h db -p 5432 -U $DB_USER; do sleep 2; done && \
    python manage.py migrate && python manage.py collectstatic --noinput"

# 10️⃣ 設定啟動指令
CMD ["gunicorn", "sonic_vision.wsgi:application", "--bind", "0.0.0.0:8000"]