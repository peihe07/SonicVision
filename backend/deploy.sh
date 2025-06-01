#!/bin/bash

# 停止服務
sudo systemctl stop sonicvision

# 更新代碼
git pull origin main

# 安裝依賴
source .venv/bin/activate
pip install -r requirements.txt

# 創建日誌目錄
sudo mkdir -p /var/log/sonicvision
sudo chown -R www-data:www-data /var/log/sonicvision

# 設置日誌輪轉
sudo cp logrotate.conf /etc/logrotate.d/sonicvision

# 收集靜態文件
python manage.py collectstatic --noinput

# 數據庫遷移
python manage.py migrate

# 重啟服務
sudo systemctl daemon-reload
sudo systemctl start sonicvision
sudo systemctl restart nginx

# 檢查服務狀態
sudo systemctl status sonicvision
sudo systemctl status nginx

# 檢查日誌
echo "檢查應用日誌..."
tail -n 50 /var/log/sonicvision/gunicorn.log
echo "檢查錯誤日誌..."
tail -n 50 /var/log/sonicvision/gunicorn.error.log 