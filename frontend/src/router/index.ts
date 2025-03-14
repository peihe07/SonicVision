import HomePage from '@/pages/HomePage.vue';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
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
        component: () => import('@/pages/DiscoverPage.vue')
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
        component: () => import('@/pages/MovieDetailPage.vue')
    },
    {
        path: '/music/:id',
        name: 'music-detail',
        component: HomePage,
        beforeEnter: (to: RouteLocationNormalized) => {
            const spotifyUrl = `https://open.spotify.com/track/${to.params.id}`;
            window.open(spotifyUrl, '_blank');
            return '/';
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router; 