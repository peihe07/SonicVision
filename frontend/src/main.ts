import type { ApiResponse, Movie, Music } from '@/types';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import './plugins/axios'; // 導入 axios 配置
import router from './router';
import { setupServices } from './services';

// Vuetify
import '@mdi/font/css/materialdesignicons.min.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

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

// 初始化服務
setupServices(app);

// 定義全局屬性的類型
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $api: {
            getTrendingMusic: () => Promise<ApiResponse<Music>>;
            getTrendingMovies: () => Promise<ApiResponse<Movie>>;
        }
    }
}

app.mount('#app');