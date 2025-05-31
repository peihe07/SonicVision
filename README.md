# SonicVision

![SonicVision](https://github.com/user-attachments/assets/2debcd41-81b5-411e-9da1-53a61572321a)

一個現代化的音樂和電影整合平台，使用 Django + Vue.js 構建。整合 Spotify API 和 TMDB API，提供音樂和電影的搜索、收藏和社交功能。

## 主要功能

### 音樂功能
- Spotify 音樂搜索和預覽
- 音樂播放列表管理
- 音樂推薦系統
- 即時音樂分享

### 電影功能
- TMDB 電影搜索
- 觀看清單管理
- 電影推薦系統
- 電影評分和評論

### 社交功能
- 用戶個人資料
- 社群互動
- 通知中心
- 好友系統

### 整合功能
- Google 帳號登入
- Spotify 連結
- YouTube 影片連結
- 個人化推薦

## 技術棧

### 後端
- Python 3.9+
- Django 4.2
- Django REST Framework
- JWT 認證
- PostgreSQL (生產環境)
- Spotify API 整合
- TMDB API 整合
- Google OAuth2
- WebSocket 支援

### 前端
- Vue.js 3
- TypeScript
- Pinia (狀態管理)
- Vue Router
- Vuetify 3 (UI 框架)
- Socket.IO (實時通訊)
- Axios
- TailwindCSS

### 開發工具
- Docker & Docker Compose
- npm (Node.js 依賴管理)
- Vue CLI
- Black (Python 代碼格式化)
- Flake8 (Python 代碼檢查)
- isort (Python import 排序)
- ESLint & TypeScript ESLint
- SASS/SCSS

## 快速開始

### 使用開發腳本（推薦）

1. 確保已安裝必要的開發工具
2. 運行開發腳本：
   ```bash
   ./dev.sh
   ```
3. 訪問：
   - 前端：http://localhost:8080
   - 後端 API：http://localhost:8000
   - API 文檔：http://localhost:8000/api/docs/

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
   - 前端：http://localhost:8080
   - 後端 API：http://localhost:8000
   - API 文檔：http://localhost:8000/api/docs/

### 本地開發

#### 後端設置
1. 進入後端目錄：
   ```bash
   cd backend
   ```
2. 創建虛擬環境：
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/Mac
   # 或
   .venv\Scripts\activate  # Windows
   ```
3. 安裝依賴：
   ```bash
   pip install -r requirements.txt
   ```
4. 設置環境變數：
   ```bash
   cp .env.example .env
   ```
5. 運行遷移：
   ```bash
   python manage.py migrate
   ```
6. 啟動開發服務器：
   ```bash
   python manage.py runserver
   ```

#### 前端設置
1. 進入前端目錄：
   ```bash
   cd frontend
   ```
2. 設置環境變數：
   ```bash
   cp .env.example .env
   ```
3. 安裝依賴：
   ```bash
   npm install
   ```
4. 啟動開發服務器：
   ```bash
   npm run dev
   ```

## 開發指南

- 遵循 [Python 風格指南 (PEP 8)](https://www.python.org/dev/peps/pep-0008/)
- 遵循 [Vue.js 風格指南](https://v3.vuejs.org/style-guide/)
- 提交前運行測試：
  ```bash
  # 後端測試
  pytest
  
  # 前端測試
  npm run test
  ```

## 貢獻指南

1. Fork 本專案
2. 創建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件 
