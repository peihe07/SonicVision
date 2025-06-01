import DiscoverPage from '@/pages/DiscoverPage.vue';
import HomePage from '@/pages/HomePage.vue';
import MovieDetailPage from '@/pages/MovieDetailPage.vue';
import MusicDetailPage from '@/pages/MusicDetailPage.vue';
import SpotifyPlaylistsPage from '@/pages/SpotifyPlaylistsPage.vue';
import TmdbListsPage from '@/pages/TmdbListsPage.vue';
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
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/ForgotPasswordPage.vue'),
        meta: { guest: true }
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: () => import('@/pages/AuthCallback.vue')
    },
    {
        path: '/playlists',
        name: 'playlists',
        component: () => import('@/pages/PlaylistPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/playlists/:id',
        name: 'playlist-detail',
        component: () => import('@/pages/PlaylistDetailPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/watchlists',
        name: 'watchlists',
        redirect: '/tmdb-lists'
    },
    {
        path: '/watchlists/:id',
        redirect: '/tmdb-lists'
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
        path: '/spotify-playlists',
        name: 'spotify-playlists',
        component: SpotifyPlaylistsPage,
        meta: {
            title: 'Spotify 推薦歌單'
        }
    },
    {
        path: '/tmdb-lists',
        name: 'tmdb-lists',
        component: TmdbListsPage,
        meta: {
            title: 'TMDB 推薦片單'
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// 導航守衛
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } });
    } else if (to.meta.guest && isAuthenticated) {
        next({ name: 'home' });
    } else {
        next();
    }
});

export default router; 