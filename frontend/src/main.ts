import type { ApiResponse, Movie, Music } from '@/types';
import axios from 'axios';
import { createPinia } from 'pinia';
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

// 設置 axios 默認配置
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

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