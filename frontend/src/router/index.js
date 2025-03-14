import AboutPage from "@/pages/AboutPage.vue";
import CommunityPage from "@/pages/CommunityPage.vue";
import DiscoverPage from "@/pages/DiscoverPage.vue";
import HomePage from "@/pages/HomePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import PlaylistsPage from "@/pages/PlaylistsPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import UserProfile from "@/pages/UserProfile.vue";
import WatchlistsPage from "@/pages/WatchlistsPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "HomePage", component: HomePage },
  { path: "/discover", name: "DiscoverPage", component: DiscoverPage },
  { path: "/playlists", name: "PlaylistsPage", component: PlaylistsPage, meta: { requiresAuth: true } },
  { path: "/watchlists", name: "WatchlistsPage", component: WatchlistsPage, meta: { requiresAuth: true } },
  { path: "/community", name: "CommunityPage", component: CommunityPage },
  { path: "/about", name: "AboutPage", component: AboutPage },
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/register", name: "RegisterPage", component: RegisterPage },
  { path: "/profile", name: "UserProfile", component: UserProfile },
  { path: "/:pathMatch(.*)*", name: "NotFoundPage", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // 檢查用戶是否已登入

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 如果需要驗證但未登入，重定向到登入頁面
  } else {
    next(); // 繼續導航
  }
});

export default router;