# 使用 Node.js 20
FROM node:20

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm install

# 複製所有前端程式碼
COPY . .

# 啟動 Vue 開發伺服器
CMD ["npm", "run", "dev"]