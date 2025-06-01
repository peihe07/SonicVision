import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240, // 只壓縮大於 10KB 的文件
            deleteOriginFile: false, // 保留原始文件
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 8080,
        proxy: {
            '/api': {
                target: process.env.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/ws': {
                target: process.env.VITE_WS_BASE_URL,
                ws: true,
            }
        }
    },
    build: {
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['vue', 'vue-router', 'pinia', 'vuetify'],
                    'utils': ['axios', 'socket.io-client'],
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
}) 