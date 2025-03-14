import type { ApiResponse, Movie, Music } from '@/types';
import axios from 'axios';
import { createPinia } from 'pinia';
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

// 設置 axios 默認配置
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// 添加請求攔截器
axios.interceptors.request.use(
    (config) => {
        // 從 localStorage 獲取 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加響應攔截器
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // 處理特定的錯誤狀態
            switch (error.response.status) {
                case 401:
                    // 未授權，可能需要重新登入
                    console.error('未授權訪問');
                    break;
                case 403:
                    // 禁止訪問
                    console.error('禁止訪問');
                    break;
                case 404:
                    // 資源不存在
                    console.error('請求的資源不存在');
                    break;
                case 500:
                    // 服務器錯誤
                    console.error('服務器錯誤');
                    break;
                default:
                    console.error('請求失敗');
            }
        } else if (error.request) {
            // 請求已發出，但沒有收到響應
            console.error('無法連接到服務器');
        } else {
            // 請求配置有誤
            console.error('請求配置錯誤:', error.message);
        }
        return Promise.reject(error);
    }
);

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

// 定義全局屬性的類型
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $api: {
            getTrendingMusic: () => Promise<ApiResponse<Music>>;
            getTrendingMovies: () => Promise<ApiResponse<Movie>>;
        }
    }
}

app.mount("#app");