import multiprocessing
import os

# 工作進程數
workers = multiprocessing.cpu_count() * 2 + 1

# 綁定地址
bind = "0.0.0.0:8000"

# 工作模式
worker_class = "sync"

# 日誌設置
accesslog = "/var/log/sonicvision/access.log"
errorlog = "/var/log/sonicvision/error.log"
loglevel = "debug"

# 進程名稱
proc_name = "sonicvision"

# 超時設置
timeout = 120
keepalive = 5

# 最大請求數
max_requests = 1000
max_requests_jitter = 50

# 重啟工作進程
graceful_timeout = 120

# 預加載應用
preload_app = True
reload = True

def on_starting(server):
    """
    服務啟動時的回調函數
    """
    # 確保日誌目錄存在
    os.makedirs("/var/log/sonicvision", exist_ok=True) 