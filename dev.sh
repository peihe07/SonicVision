#!/bin/bash

# 獲取項目根目錄的絕對路徑
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# 啟動前端開發服務器
cd "$PROJECT_ROOT/frontend" && npm run serve &

# 等待前端服務器啟動
sleep 5

# 啟動後端服務器
cd "$PROJECT_ROOT/backend" && python manage.py runserver 