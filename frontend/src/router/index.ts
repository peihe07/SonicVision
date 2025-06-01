import MovieDetailPage from '@/pages/MovieDetailPage.vue';
import MusicDetailPage from '@/pages/MusicDetailPage.vue';
import SpotifyPlaylistsPage from '@/pages/SpotifyPlaylistsPage.vue';
import TmdbListsPage from '@/pages/TmdbListsPage.vue';
import WatchlistsPage from '@/pages/WatchlistsPage.vue';
import { useAuthStore } from '@/store/modules/auth';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/discover',
        name: 'Discover',
        component: () => import('@/pages/DiscoverPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/latest-music',
        name: 'LatestMusic',
        component: () => import('@/pages/LatestMusicPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/watchlists',
        name: 'Watchlists',
        component: WatchlistsPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/community',
        name: 'Community',
        component: () => import('@/pages/CommunityPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/AboutPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/pages/RegisterPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { requiresAuth: true }
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
            title: 'Spotify 推薦歌單',
            requiresAuth: false
        }
    },
    {
        path: '/tmdb-lists',
        name: 'tmdb-lists',
        component: TmdbListsPage,
        meta: {
            title: 'TMDB 推薦片單',
            requiresAuth: false
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