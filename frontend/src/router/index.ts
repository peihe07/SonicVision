import DiscoverPage from '@/pages/DiscoverPage.vue';
import HomePage from '@/pages/HomePage.vue';
import MovieDetailPage from '@/pages/MovieDetailPage.vue';
import MusicDetailPage from '@/pages/MusicDetailPage.vue';
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
        component: () => import('@/pages/RegisterPage.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue')
    },
    {
        path: '/playlists',
        name: 'playlists',
        component: () => import('@/pages/PlaylistsPage.vue')
    },
    {
        path: '/watchlists',
        name: 'watchlists',
        component: () => import('@/pages/WatchlistsPage.vue')
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
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router; 