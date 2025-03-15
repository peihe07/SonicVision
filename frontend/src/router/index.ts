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
        path: '/playlists',
        name: 'playlists',
        redirect: '/spotify-playlists'
    },
    {
        path: '/playlists/:id',
        redirect: '/spotify-playlists'
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