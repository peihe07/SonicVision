import About from "@/pages/About.vue";
import Community from "@/pages/Community.vue";
import Discover from "@/pages/Discover.vue";
import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import NotFound from "@/pages/NotFound.vue";
import Playlists from "@/pages/Playlists.vue";
import Register from "@/pages/Register.vue";
import Watchlists from "@/pages/Watchlists.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/discover",
    name: "Discover",
    component: Discover
  },
  {
    path: "/playlists",
    name: "Playlists",
    component: Playlists,
    meta: { requiresAuth: true }
  },
  {
    path: "/watchlists",
    name: "Watchlists",
    component: Watchlists,
    meta: { requiresAuth: true }
  },
  {
    path: "/community",
    name: "Community",
    component: Community
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // 檢查用戶是否已登入

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 如果需要驗證但未登入，重定向到登入頁面
  } else {
    next(); // 繼續導航
  }
});

export default router;