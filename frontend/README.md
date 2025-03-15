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
- JWT 令牌管理
- 用戶會話管理

### 音樂模組
- Spotify API 整合
- 音樂搜索
- 播放列表管理
- 音樂播放器

### 電影模組
- TMDB API 整合
- 電影搜索
- 觀看清單
- 電影詳情頁

### 社交模組
- 用戶資料
- 好友系統
- 通知中心
- 即時聊天

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

### 代碼規範
- 使用 ESLint 和 Prettier
- 遵循 Vue.js 風格指南
- 使用 TypeScript 類型註解
- 組件使用 Composition API

### 測試
- 單元測試：`npm run test:unit`
- E2E 測試：`npm run test:e2e`
- 覆蓋率報告：`npm run test:coverage`

## 部署

### 開發環境
- 使用 Vite 開發服務器
- 熱模塊替換 (HMR)
- 源碼映射

### 生產環境
- 靜態資源優化
- 代碼分割
- 緩存策略
- CDN 配置

## 貢獻指南
1. Fork 專案
2. 創建特性分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

## 注意事項
- 確保 API 密鑰安全
- 遵循版本控制規範
- 及時更新依賴
- 保持代碼覆蓋率
