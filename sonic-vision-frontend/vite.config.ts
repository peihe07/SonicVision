import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => ({
  base: "/static/", // 確保 Django 伺服器能正確提供
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",  // ✅ 讓外部可以訪問
    port: 5173,  // ✅ 確保使用 5173 端口
    proxy: {
      "/api": {
        target: "http://web:8000", // ✅ 修正 Django API 的 Proxy 設定
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",  // ✅ 確保 Vite build 後輸出到 `dist/`
  },
}));