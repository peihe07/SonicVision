import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


// 🔹 引入 Bootstrap CSS
import 'https://bootswatch.com/5/lux/bootstrap.min.css';

// 🔹 引入 Bootstrap JavaScript（包含 Modal、Navbar 等功能）
import 'bootstrap';

const app = createApp(App);
app.use(router);  
app.mount('#app');