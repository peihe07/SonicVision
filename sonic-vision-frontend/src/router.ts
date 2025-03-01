import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "./views/HomeView.vue";
import MusicView from "./views/MusicView.vue";
import MovieView from "./views/MovieView.vue";
import RegisterView from "./views/RegisterView.vue";
import LoginView from "./views/LoginView.vue";

  
const routes: Array<RouteRecordRaw> = [
    { path: "/", component: HomeView },
    { path: "/music", component: MusicView },
    { path: "/movies", component: MovieView },
    { path: "/register", component: RegisterView },
    { path: "/login", component: LoginView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;