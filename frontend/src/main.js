import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 確保 Vue Router 正確導入
import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");