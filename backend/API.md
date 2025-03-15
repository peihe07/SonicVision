# SonicVision API 文檔

## 認證 API

### 用戶註冊
- **端點**: `/api/auth/register/`
- **方法**: POST
- **請求體**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **響應**: 200 OK
  ```json
  {
    "token": "string",
    "user": {
      "id": "integer",
      "username": "string",
      "email": "string"
    }
  }
  ```

### 用戶登入
- **端點**: `/api/auth/login/`
- **方法**: POST
- **請求體**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **響應**: 200 OK
  ```json
  {
    "token": "string"
  }
  ```

### Google 登入
- **端點**: `/api/auth/google/`
- **方法**: POST
- **請求體**:
  ```json
  {
    "token": "string"
  }
  ```

## 音樂 API

### 搜索音樂
- **端點**: `/api/music/search/`
- **方法**: GET
- **參數**:
  - `q`: 搜索關鍵字
  - `limit`: 返回結果數量 (可選)
- **響應**: 200 OK
  ```json
  {
    "tracks": [
      {
        "id": "string",
        "name": "string",
        "artist": "string",
        "album": "string",
        "preview_url": "string",
        "spotify_url": "string"
      }
    ]
  }
  ```

### 獲取播放列表
- **端點**: `/api/music/playlists/`
- **方法**: GET
- **請求頭**: Authorization: Bearer {token}
- **響應**: 200 OK
  ```json
  {
    "playlists": [
      {
        "id": "integer",
        "name": "string",
        "tracks": [
          {
            "id": "string",
            "name": "string"
          }
        ]
      }
    ]
  }
  ```

## 電影 API

### 搜索電影
- **端點**: `/api/movies/search/`
- **方法**: GET
- **參數**:
  - `q`: 搜索關鍵字
  - `page`: 頁碼 (可選)
- **響應**: 200 OK
  ```json
  {
    "results": [
      {
        "id": "integer",
        "title": "string",
        "overview": "string",
        "poster_path": "string",
        "release_date": "string"
      }
    ],
    "total_pages": "integer"
  }
  ```

### 獲取觀看清單
- **端點**: `/api/movies/watchlist/`
- **方法**: GET
- **請求頭**: Authorization: Bearer {token}
- **響應**: 200 OK
  ```json
  {
    "watchlist": [
      {
        "id": "integer",
        "title": "string",
        "added_date": "string"
      }
    ]
  }
  ```

## 用戶 API

### 獲取用戶資料
- **端點**: `/api/users/profile/`
- **方法**: GET
- **請求頭**: Authorization: Bearer {token}
- **響應**: 200 OK
  ```json
  {
    "id": "integer",
    "username": "string",
    "email": "string",
    "profile": {
      "avatar": "string",
      "bio": "string"
    }
  }
  ```

### 更新用戶資料
- **端點**: `/api/users/profile/`
- **方法**: PUT
- **請求頭**: Authorization: Bearer {token}
- **請求體**:
  ```json
  {
    "username": "string",
    "email": "string",
    "profile": {
      "avatar": "string",
      "bio": "string"
    }
  }
  ```

## 通知 API

### 獲取通知
- **端點**: `/api/notifications/`
- **方法**: GET
- **請求頭**: Authorization: Bearer {token}
- **響應**: 200 OK
  ```json
  {
    "notifications": [
      {
        "id": "integer",
        "type": "string",
        "message": "string",
        "created_at": "string",
        "is_read": "boolean"
      }
    ]
  }
  ```

## 錯誤處理

所有 API 端點在發生錯誤時將返回以下格式的響應：

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

常見錯誤碼：
- 400: 請求參數錯誤
- 401: 未授權
- 403: 禁止訪問
- 404: 資源不存在
- 500: 服務器錯誤 