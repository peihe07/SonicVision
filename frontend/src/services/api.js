import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || '/api';

// 創建 axios 實例
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 請求攔截器
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 響應攔截器
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 認證相關 API
export const auth = {
    login: (data) => api.post('/login', data),
    register: (data) => api.post('/register', data),
    logout: () => api.post('/logout'),
    getProfile: () => api.get('/profile'),
    updateProfile: (data) => api.put('/profile', data),
    googleAuth: (token) => api.post('/google', { token })
};

// 音樂相關 API
export const music = {
    search: (query) => api.get('/music/search', { params: { query } }),
    getDetails: (id) => api.get(`/music/${id}`),
    getRecommendations: () => api.get('/music/recommendations'),
    addToPlaylist: (playlistId, musicId) => api.post(`/playlists/${playlistId}/music`, { musicId }),
    removeFromPlaylist: (playlistId, musicId) => api.delete(`/playlists/${playlistId}/music/${musicId}`)
};

// 電影相關 API
export const movies = {
    search: (query) => api.get('/movies/search', { params: { query } }),
    getDetails: (id) => api.get(`/movies/${id}`),
    getRecommendations: () => api.get('/movies/recommendations'),
    addToWatchlist: (movieId) => api.post('/watchlist', { movieId }),
    removeFromWatchlist: (movieId) => api.delete(`/watchlist/${movieId}`)
};

// 歌單相關 API
export const playlists = {
    getAll: () => api.get('/playlists'),
    create: (data) => api.post('/playlists', data),
    update: (id, data) => api.put(`/playlists/${id}`, data),
    delete: (id) => api.delete(`/playlists/${id}`),
    getDetails: (id) => api.get(`/playlists/${id}`)
};

// 片單相關 API
export const watchlists = {
    getAll: () => api.get('/watchlists'),
    create: (data) => api.post('/watchlists', data),
    update: (id, data) => api.put(`/watchlists/${id}`, data),
    delete: (id) => api.delete(`/watchlists/${id}`),
    getDetails: (id) => api.get(`/watchlists/${id}`)
};

// 評論相關 API
export const reviews = {
    create: (type, id, data) => api.post(`/${type}/${id}/reviews`, data),
    update: (type, id, reviewId, data) => api.put(`/${type}/${id}/reviews/${reviewId}`, data),
    delete: (type, id, reviewId) => api.delete(`/${type}/${id}/reviews/${reviewId}`),
    getAll: (type, id) => api.get(`/${type}/${id}/reviews`)
};

// 社群相關 API
export const community = {
    getDiscussions: () => api.get('/discussions'),
    createDiscussion: (data) => api.post('/discussions', data),
    getComments: (discussionId) => api.get(`/discussions/${discussionId}/comments`),
    addComment: (discussionId, data) => api.post(`/discussions/${discussionId}/comments`, data)
};

export default {
    auth,
    music,
    movies,
    playlists,
    watchlists,
    reviews,
    community
}; 