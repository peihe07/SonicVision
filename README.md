# SonicVision

![SonicVision](https://github.com/user-attachments/assets/2debcd41-81b5-411e-9da1-53a61572321a)

一個現代化的音樂和電影整合平台，使用 Django + Vue.js 構建。整合 Spotify API 和 TMDB API，提供音樂和電影的搜索、收藏和社交功能。

## 主要功能

### 音樂功能
- Spotify 音樂搜索和預覽
  - 即時搜索結果
  - 音樂預覽播放
  - 專輯封面顯示
  - 藝術家資訊
- 音樂播放列表管理
  - 創建和編輯播放列表
  - 添加/移除歌曲
  - 播放列表封面自定義
  - 播放列表分享
- 音樂推薦系統
  - 基於用戶喜好的推薦
  - 熱門音樂推薦
  - 新發行音樂推薦
- 即時音樂分享
  - 社交媒體分享
  - 直接分享連結
  - 嵌入播放器

### 電影功能
- TMDB 電影搜索
  - 即時搜索結果
  - 電影海報顯示
  - 詳細電影資訊
  - 評分和評論
- 觀看清單管理
  - 創建和編輯清單
  - 添加/移除電影
  - 標記觀看狀態
  - 清單分享
- 電影推薦系統
  - 基於用戶喜好的推薦
  - 熱門電影推薦
  - 即將上映電影
- 電影評分和評論
  - 用戶評分系統
  - 評論功能
  - 評論互動

### 社交功能
- 用戶個人資料
  - 個人資訊管理
  - 頭像上傳
  - 活動歷史
  - 統計數據
- 社群互動
  - 貼文發布
  - 評論功能
  - 點讚系統
  - 分享功能
- 通知中心
  - 即時通知
  - 通知分類
  - 已讀/未讀狀態
  - 通知設置
- 好友系統
  - 用戶追蹤
  - 好友列表
  - 互動記錄
  - 隱私設置

### 整合功能
- Google 帳號登入
  - OAuth2 認證
  - 帳號連結
  - 個人資料同步
- Spotify 連結
  - 帳號授權
  - 播放列表同步
  - 音樂收藏同步
- YouTube 影片連結
  - 電影預告片
  - 音樂影片
  - 嵌入播放
- 個人化推薦
  - 基於用戶行為
  - 興趣分析
  - 動態更新

## 技術棧

### 環境要求
- Node.js 18.0.0 或更高版本
- Python 3.9.0 或更高版本
- PostgreSQL 14.0 或更高版本
- Docker 24.0.0 或更高版本（可選）
- Docker Compose 2.0.0 或更高版本（可選）

### 後端
- Python 3.9+
- Django 5.0.3
- Django REST Framework 3.14.0
- JWT 認證 (djangorestframework-simplejwt 5.3.0)
- PostgreSQL (生產環境)
- Spotify API 整合 (spotipy 2.23.0)
- TMDB API 整合
- Google OAuth2 (social-auth-app-django 5.4.0)
- WebSocket 支援 (channels 4.0.0)
- Channels Redis 4.2.0
- Daphne 4.1.0

### 前端
- Vue.js 3.5.16
- TypeScript 5.3.3
- Vite 6.3.5 (構建工具)
- Pinia 3.0.2 (狀態管理)
- Vue Router 4.5.1
- Vuetify 3.8.7 (UI 框架)
- Socket.IO Client 4.7.4 (實時通訊)
- Axios 1.9.0
- SASS 1.89.1
- Font Awesome 6.5.1
- Material Design Icons 7.4.47

### 開發工具
- Docker & Docker Compose
- npm 9.0+
- Black 23.7.0 (Python 代碼格式化)
- Flake8 6.1.0 (Python 代碼檢查)
- isort 5.12.0 (Python import 排序)
- ESLint 9.28.0 & TypeScript ESLint
- Prettier 3.2.5 (代碼格式化)
- Vite Plugin Vuetify 2.0.0
- Vite Plugin Compression 0.5.1
- pytest 7.4.0 (測試框架)
- pytest-django 4.5.2 (Django 測試)
- pytest-cov 4.1.0 (測試覆蓋率)

## 快速開始

### 使用開發腳本（推薦）

1. 確保已安裝必要的開發工具
2. 運行開發腳本：
   ```bash
   ./dev.sh
   ```
3. 訪問：
   - 前端：https://sonicvision.uno
   - 後端 API：https://sonicvision.uno/api
   - API 文檔：https://sonicvision.uno/api/docs/

### 使用 Docker

1. 確保已安裝 Docker 和 Docker Compose
2. 複製環境變數文件：
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. 啟動服務：
   ```bash
   docker-compose up -d
   ```
4. 訪問：
   - 前端：https://sonicvision.uno
   - 後端 API：https://sonicvision.uno/api
   - API 文檔：https://sonicvision.uno/api/docs/

### 本地開發

1. 後端開發：
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. 前端開發：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. 訪問：
   - 前端：https://sonicvision.uno
   - 後端 API：https://sonicvision.uno/api
   - API 文檔：https://sonicvision.uno/api/docs/

## 環境變數配置

### 後端環境變數 (.env)
```
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=sonicvision.uno
CORS_ALLOWED_ORIGINS=https://sonicvision.uno
DATABASE_URL=postgres://user:password@localhost:5432/sonicvision
```

### 前端環境變數 (.env)
```
VITE_API_URL=https://sonicvision.uno/api
VITE_WS_URL=wss://sonicvision.uno/ws
```

## 貢獻指南

1. Fork 本專案
2. 創建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 部署指南

### 生產環境要求
- 2+ CPU 核心
- 4GB+ RAM
- 20GB+ 硬碟空間
- Ubuntu 20.04 LTS 或更高版本
- Nginx 1.18+
- PostgreSQL 14+

### 部署步驟

1. 服務器準備
   ```bash
   # 更新系統
   sudo apt update && sudo apt upgrade -y
   
   # 安裝必要套件
   sudo apt install -y nginx postgresql postgresql-contrib python3-pip nodejs npm
   ```

2. 數據庫設置
   ```bash
   # 創建數據庫和用戶
   sudo -u postgres psql
   CREATE DATABASE sonicvision;
   CREATE USER sonicvision WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE sonicvision TO sonicvision;
   ```

3. 後端部署
   ```bash
   # 克隆代碼
   git clone https://github.com/your-username/sonicvision.git
   cd sonicvision/backend
   
   # 設置虛擬環境
   python3 -m venv .venv
   source .venv/bin/activate
   
   # 安裝依賴
   pip install -r requirements.txt
   
   # 設置環境變數
   cp .env.example .env
   # 編輯 .env 文件，設置生產環境配置
   
   # 收集靜態文件
   python manage.py collectstatic
   
   # 運行數據庫遷移
   python manage.py migrate
   ```

4. 前端部署
   ```bash
   cd ../frontend
   
   # 安裝依賴
   npm install
   
   # 設置環境變數
   cp .env.example .env
   # 編輯 .env 文件，設置生產環境配置
   
   # 構建生產版本
   npm run build
   ```

5. Nginx 配置
   ```nginx
   # /etc/nginx/sites-available/sonicvision
   server {
       listen 80;
       server_name your-domain.com;
   
       # 前端
       location / {
           root /path/to/sonicvision/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
   
       # 後端 API
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   
       # WebSocket
       location /ws {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

6. 啟動服務
   ```bash
   # 啟用 Nginx 配置
   sudo ln -s /etc/nginx/sites-available/sonicvision /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   
   # 使用 Gunicorn 運行後端
   cd backend
   gunicorn -w 4 -b 127.0.0.1:8000 sonicvision.wsgi:application
   ```

### 性能優化建議

1. 數據庫優化
   - 使用數據庫連接池
   - 建立適當的索引
   - 定期維護和優化

2. 緩存策略
   - 使用 Redis 進行緩存
   - 實現 CDN 加速
   - 啟用瀏覽器緩存

3. 負載均衡
   - 使用 Nginx 負載均衡
   - 配置多個 Gunicorn 工作進程
   - 實現健康檢查

4. 監控和日誌
   - 使用 Prometheus 監控
   - 配置 ELK 日誌系統
   - 設置警報機制

### 安全建議

1. SSL/TLS 配置
   ```bash
   # 使用 Let's Encrypt 獲取 SSL 證書
   sudo certbot --nginx -d your-domain.com
   ```

2. 防火牆設置
   ```bash
   # 配置 UFW
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. 定期更新
   - 設置自動安全更新
   - 定期更新依賴包
   - 監控安全公告

## 故障排除

### 常見問題

1. 後端服務無法啟動
   ```bash
   # 檢查日誌
   tail -f /var/log/nginx/error.log
   tail -f /var/log/gunicorn/error.log
   
   # 檢查端口佔用
   sudo lsof -i :8000
   
   # 檢查數據庫連接
   python manage.py check
   ```

2. 前端構建失敗
   ```bash
   # 清除緩存
   npm cache clean --force
   rm -rf node_modules
   npm install
   
   # 檢查依賴版本
   npm outdated
   
   # 檢查構建日誌
   npm run build --verbose
   ```

3. 數據庫問題
   ```bash
   # 檢查數據庫連接
   psql -U sonicvision -d sonicvision -h localhost
   
   # 檢查數據庫日誌
   tail -f /var/log/postgresql/postgresql-14-main.log
   
   # 修復數據庫
   python manage.py dbshell
   ```

### 日誌管理

1. 日誌配置
   ```python
   # settings.py
   LOGGING = {
       'version': 1,
       'disable_existing_loggers': False,
       'handlers': {
           'file': {
               'level': 'INFO',
               'class': 'logging.FileHandler',
               'filename': 'debug.log',
           },
       },
       'loggers': {
           'django': {
               'handlers': ['file'],
               'level': 'INFO',
               'propagate': True,
           },
       },
   }
   ```

2. 日誌查看
   ```bash
   # 實時查看日誌
   tail -f debug.log
   
   # 搜索錯誤
   grep ERROR debug.log
   
   # 查看特定時間的日誌
   sed -n '/2024-02-20 10:00:00/,/2024-02-20 11:00:00/p' debug.log
   ```

### 監控系統

1. 系統監控
   ```bash
   # 安裝 Prometheus
   sudo apt install prometheus
   
   # 安裝 Node Exporter
   sudo apt install prometheus-node-exporter
   
   # 配置 Prometheus
   sudo nano /etc/prometheus/prometheus.yml
   ```

2. 應用監控
   ```python
   # 使用 Prometheus 客戶端
   from prometheus_client import Counter, Histogram
   
   # 定義指標
   REQUEST_COUNT = Counter('request_count', 'Total request count')
   REQUEST_LATENCY = Histogram('request_latency_seconds', 'Request latency')
   ```

3. 警報配置
   ```yaml
   # alertmanager.yml
   global:
     resolve_timeout: 5m
   
   route:
     group_by: ['alertname']
     group_wait: 10s
     group_interval: 10s
     repeat_interval: 1h
     receiver: 'email-notifications'
   
   receivers:
   - name: 'email-notifications'
     email_configs:
     - to: 'admin@example.com'
       from: 'alertmanager@example.com'
       smarthost: 'smtp.example.com:587'
   ```

### 性能優化

1. 數據庫優化
   ```sql
   -- 分析查詢性能
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
   
   -- 創建索引
   CREATE INDEX idx_users_email ON users(email);
   
   -- 優化表
   VACUUM ANALYZE users;
   ```

2. 緩存優化
   ```python
   # 使用 Redis 緩存
   from django.core.cache import cache
   
   # 設置緩存
   cache.set('key', 'value', timeout=3600)
   
   # 獲取緩存
   value = cache.get('key')
   ```

3. 前端優化
   ```javascript
   // 使用路由懶加載
   const routes = [
     {
       path: '/profile',
       component: () => import('./views/Profile.vue')
     }
   ]
   
   // 使用 keep-alive
   <keep-alive>
     <router-view></router-view>
   </keep-alive>
   ```

## API 文檔

API 文檔使用 Swagger UI 提供，可以通過以下方式訪問：

- 生產環境：https://sonicvision.uno/api/docs/
- 開發環境：https://sonicvision.uno/api/docs/

API 文檔包含：
- 所有可用的 API 端點
- 請求/響應格式
- 認證要求
- 示例請求

## 部署

### 使用 Docker Compose 部署

1. 克隆倉庫：
   ```bash
   git clone https://github.com/yourusername/sonicvision.git
   cd sonicvision
   ```

2. 配置環境變數：
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. 啟動服務：
   ```bash
   docker-compose up -d
   ```

4. 訪問：
   - 前端：https://sonicvision.uno
   - 後端 API：https://sonicvision.uno/api
   - API 文檔：https://sonicvision.uno/api/docs/
