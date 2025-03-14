import type { ApiResponse, Movie, Music } from '@/types';
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 模擬數據
const mockTrendingMusic: Music[] = [
    {
        id: 1,
        title: "模擬音樂 1",
        artist: "藝術家 1",
        coverUrl: "https://via.placeholder.com/300",
        rating: 4.5,
        genre: "流行"
    },
    {
        id: 2,
        title: "模擬音樂 2",
        artist: "藝術家 2",
        coverUrl: "https://via.placeholder.com/300",
        rating: 4.2,
        genre: "搖滾"
    }
];

const mockTrendingMovies: Movie[] = [
    {
        id: 1,
        title: "模擬電影 1",
        poster_path: "https://via.placeholder.com/300",
        vote_average: 8.5,
        release_date: "2024-01-01"
    },
    {
        id: 2,
        title: "模擬電影 2",
        poster_path: "https://via.placeholder.com/300",
        vote_average: 7.8,
        release_date: "2024-02-01"
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
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username,
                password,
                email
            });
            return response.data;
        } catch (error) {
            console.error('註冊失敗:', error);
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