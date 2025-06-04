FROM nginx:alpine

# 複製 Nginx 配置文件
COPY docker/nginx/conf.d /etc/nginx/conf.d

# 創建必要的目錄
RUN mkdir -p /app/staticfiles /app/media /var/log/nginx

# 設置權限
RUN chown -R nginx:nginx /app /var/log/nginx

# 暴露端口
EXPOSE 80 443

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"] 