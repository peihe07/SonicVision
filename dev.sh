#!/bin/bash

# 啟動前端開發服務器
cd frontend && npm run serve &

# 等待前端服務器啟動
sleep 5

# 啟動後端服務器
cd ../backend && python manage.py runserver 