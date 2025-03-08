import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// ✅ 確保 Bootstrap 样式已加载
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// ✅ 確保全局樣式已載入（如果你有 custom.scss）
import "./assets/main.css";  

const app = createApp(App);
app.use(router);

// ✅ 確保 Vue 頁面正確掛載
app.mount('#app');