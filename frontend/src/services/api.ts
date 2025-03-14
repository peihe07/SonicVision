import type { User } from '@/store/modules/auth';
import type { ApiResponse, Movie, Music } from '@/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// 創建 axios 實例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,  // 允許跨域請求攜帶 cookie
});

// 獲取 CSRF Token
const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
};

// 請求攔截器：添加認證信息
apiClient.interceptors.request.use(config => {
    // 添加 CSRF Token
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }

    // 添加 JWT Token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// 響應攔截器：處理認證錯誤
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // 清除無效的 token
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

// 模擬數據
const mockTrendingMusic: Music[] = [
    {
        id: 1,
        title: '模擬音樂 1',
        artist: '模擬藝術家 1',
        coverUrl: 'https://via.placeholder.com/300',
        rating: 4.5
    },
    {
        id: 2,
        title: '模擬音樂 2',
        artist: '模擬藝術家 2',
        coverUrl: 'https://via.placeholder.com/300',
        rating: 4.8
    }
];

const mockTrendingMovies: Movie[] = [
    {
        id: 1,
        title: '模擬電影 1',
        poster_path: '/placeholder1.jpg',
        vote_average: 8.5,
        release_date: '2024-01-01'
    },
    {
        id: 2,
        title: '模擬電影 2',
        poster_path: '/placeholder2.jpg',
        vote_average: 7.9,
        release_date: '2024-02-01'
    }
];

export const getTrendingMusic = async (): Promise<ApiResponse<Music>> => {
    try {
        const response = await apiClient.get<ApiResponse<Music>>('/music/trending');
        return response.data;
    } catch (error) {
        console.warn('使用模擬數據替代 API 響應');
        return {
            data: {
                items: mockTrendingMusic,
                total: mockTrendingMusic.length
            }
        };
    }
};

export const getTrendingMovies = async (): Promise<ApiResponse<Movie>> => {
    try {
        const response = await apiClient.get<ApiResponse<Movie>>('/movies/trending');
        return response.data;
    } catch (error) {
        console.warn('使用模擬數據替代 API 響應');
        return {
            data: {
                items: mockTrendingMovies,
                total: mockTrendingMovies.length
            }
        };
    }
};

export const auth = {
    login: async (username: string, password: string) => {
        try {
            const response = await apiClient.post('/login/', {
                username,
                password
            });
            return response.data;
        } catch (error) {
            console.error('登入失敗:', error);
            throw error;
        }
    },
    register: async (username: string, password: string, email: string) => {
        try {
            const response = await apiClient.post('/register/', {
                username,
                password,
                email
            });
            return response.data;
        } catch (error) {
            console.error('註冊失敗:', error);
            throw error;
        }
    },
    getProfile: async () => {
        try {
            const response = await apiClient.get('/profile/');
            return response.data;
        } catch (error) {
            console.error('獲取用戶資料失敗:', error);
            throw error;
        }
    },
    updateProfile: async (userData: Partial<User>) => {
        try {
            const response = await apiClient.put('/profile/', userData);
            return response.data;
        } catch (error) {
            console.error('更新個人資料失敗:', error);
            throw error;
        }
    },
    logout: async () => {
        try {
            await apiClient.post('/logout/');
        } catch (error) {
            console.error('登出失敗:', error);
            throw error;
        }
    }
};

export const playlists = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/playlists`);
            return response.data;
        } catch (error) {
            console.error('獲取播放清單失敗:', error);
            throw error;
        }
    },
    create: async (name: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/playlists`, { name });
            return response.data;
        } catch (error) {
            console.error('創建播放清單失敗:', error);
            throw error;
        }
    }
};

export const watchlists = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/watchlists`);
            return response.data;
        } catch (error) {
            console.error('獲取觀看清單失敗:', error);
            throw error;
        }
    },
    create: async (name: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/watchlists`, { name });
            return response.data;
        } catch (error) {
            console.error('創建觀看清單失敗:', error);
            throw error;
        }
    }
};

export async function searchMovies(query: string): Promise<Movie[]> {
    try {
        const response = await apiClient.get<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.warn('搜索電影失敗，返回空結果');
        return [];
    }
}

export async function searchMusic(query: string): Promise<Music[]> {
    try {
        const response = await apiClient.get<Music[]>(`/music/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.warn('搜索音樂失敗，返回空結果');
        return [];
    }
} 