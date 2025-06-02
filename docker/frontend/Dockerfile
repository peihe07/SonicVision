FROM node:20-alpine

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY frontend/package*.json ./

# 安裝依賴
RUN npm install --legacy-peer-deps

# 複製前端代碼

# 開放端口
EXPOSE 8080

# 啟動命令
CMD ["npm", "run", "serve"]