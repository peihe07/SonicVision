import multiprocessing
import os

# 綁定地址和端口
bind = "127.0.0.1:8000"

# 工作進程數
workers = multiprocessing.cpu_count() * 2 + 1

# 工作模式
worker_class = "uvicorn.workers.UvicornWorker"

# 超時設置
timeout = 120
keepalive = 5

# 日誌設置
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"

# 進程名稱
proc_name = "gunicorn_sonicvision"

# 守護進程模式
daemon = True

# 最大請求數
max_requests = 1000
max_requests_jitter = 50

# 重啟工作進程
preload_app = True

# 環境變數
raw_env = [
    "DJANGO_SETTINGS_MODULE=config.settings_prod",
] 