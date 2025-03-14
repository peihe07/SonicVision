import type { ApiResponse, Movie, Music } from '@/types';
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

const app = createApp(App);
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