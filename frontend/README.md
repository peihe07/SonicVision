# SonicVision 前端

## 技術棧
- Vue.js 3
- TypeScript
- Pinia (狀態管理)
- Vue Router
- Vuetify 3
- TailwindCSS
- Socket.IO
- Axios

## 目錄結構
```
frontend/
├── src/
│   ├── assets/        # 靜態資源
│   ├── components/    # 可重用組件
│   ├── views/         # 頁面組件
│   ├── router/        # 路由配置
│   ├── store/         # Pinia 狀態管理
│   ├── services/      # API 服務
│   ├── utils/         # 工具函數
│   └── types/         # TypeScript 類型定義
├── public/            # 公共資源
└── tests/             # 測試文件
```

## 主要功能模組

### 認證模組
- 用戶註冊/登入
- Google OAuth 整合
- JWT token管理

### 音樂模組
- Spotify API 整合
- 音樂搜索
- 全球最新歌曲

### 電影模組
- TMDB API 整合
- 電影搜索
- 即將上映電影列表

### 社交模組
- 用戶資料
- 通知中心

## 開發指南

### 環境設置
1. 安裝依賴：
   ```bash
   npm install
   ```

2. 開發服務器：
   ```bash
   npm run dev
   ```

3. 生產構建：
   ```bash
   npm run build
   ```