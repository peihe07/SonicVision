import DiscoverPage from '@/pages/DiscoverPage.vue';
import HomePage from '@/pages/HomePage.vue';
import MovieDetailPage from '@/pages/MovieDetailPage.vue';
import MusicDetailPage from '@/pages/MusicDetailPage.vue';
import { useAuthStore } from '@/store/modules/auth';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/discover',
        name: 'discover',
        component: DiscoverPage
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/RegisterPage.vue'),
        meta: { guest: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { guest: true }
    },
    {
        path: '/playlists',
        name: 'playlists',
        component: () => import('@/pages/PlaylistsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/watchlists',
        name: 'watchlists',
        component: () => import('@/pages/WatchlistsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/community',
        name: 'community',
        component: () => import('@/pages/CommunityPage.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/pages/AboutPage.vue')
    },
    {
        path: '/movie/:id',
        name: 'movie-detail',
        component: MovieDetailPage
    },
    {
        path: '/music/:id',
        name: 'music-detail',
        component: MusicDetailPage
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/ForgotPasswordPage.vue'),
        meta: {
            title: '忘記密碼',
            requiresAuth: false
        }
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: () => import('@/pages/AuthCallback.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 導航守衛
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuestOnly = to.matched.some(record => record.meta.guest);

    if (requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (isGuestOnly && authStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router; 