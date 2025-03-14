import type { ApiResponse, Movie, Music, NewPost, User } from '@/types';
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000/api';

// 創建 axios 實例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
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
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 添加 CSRF Token
    const csrfToken = getCsrfToken();
    if (csrfToken && config.headers) {
        config.headers['X-CSRFToken'] = csrfToken;
    }

    // 添加 JWT Token（如果存在）
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    console.error('請求攔截器錯誤:', error);
    return Promise.reject(error);
});

// 響應攔截器：處理認證錯誤
apiClient.interceptors.response.use(
    response => response,
    async error => {
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
        albumCover: 'https://via.placeholder.com/300',
        previewUrl: 'https://example.com/preview1.mp3'
    },
    {
        id: 2,
        title: '模擬音樂 2',
        artist: '模擬藝術家 2',
        albumCover: 'https://via.placeholder.com/300',
        previewUrl: 'https://example.com/preview2.mp3'
    }
];

const mockTrendingMovies: Movie[] = [
    {
        id: 1,
        title: '模擬電影 1',
        overview: '這是一部精彩的電影',
        posterPath: '/placeholder1.jpg',
        releaseDate: '2024-01-01',
        voteAverage: 8.5
    },
    {
        id: 2,
        title: '模擬電影 2',
        overview: '這是另一部精彩的電影',
        posterPath: '/placeholder2.jpg',
        releaseDate: '2024-02-01',
        voteAverage: 7.9
    }
];

export const getTrendingMusic = async (): Promise<ApiResponse<Music[]>> => {
    try {
        const response = await apiClient.get<ApiResponse<Music[]>>('/music/trending');
        return response.data;
    } catch (error) {
        console.warn('使用模擬數據替代 API 響應');
        return {
            data: mockTrendingMusic,
            message: '成功獲取熱門音樂'
        };
    }
};

export const getTrendingMovies = async (): Promise<ApiResponse<Movie[]>> => {
    try {
        const response = await apiClient.get<ApiResponse<Movie[]>>('/movies/trending');
        return response.data;
    } catch (error) {
        console.warn('使用模擬數據替代 API 響應');
        return {
            data: mockTrendingMovies,
            message: '成功獲取熱門電影'
        };
    }
};

export const auth = {
    login: async (credentials: { username: string; password: string }) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: { username: string; email: string; password: string }) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },

    updateProfile: async (profileData: Partial<User> & { avatar?: File }) => {
        const formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'avatar') {
                    formData.append(key, value as File);
                } else {
                    formData.append(key, String(value));
                }
            }
        });
        const response = await apiClient.patch('/auth/profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updatePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
        const response = await apiClient.post('/auth/password/change/', passwordData);
        return response.data;
    },

    updateNotificationSettings: async (settings: {
        email: boolean;
        newFollower: boolean;
        postInteraction: boolean;
    }) => {
        const response = await apiClient.patch('/auth/settings/notifications/', settings);
        return response.data;
    },

    updatePrivacySettings: async (settings: {
        publicProfile: boolean;
        showActivity: boolean;
        searchable: boolean;
    }) => {
        const response = await apiClient.patch('/auth/settings/privacy/', settings);
        return response.data;
    },

    deactivateAccount: async () => {
        const response = await apiClient.post('/auth/deactivate/');
        return response.data;
    },

    deleteAccount: async () => {
        const response = await apiClient.delete('/auth/delete/');
        return response.data;
    },

    requestPasswordReset: async (email: string) => {
        const response = await apiClient.post('/auth/password/reset/', { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const response = await apiClient.post('/auth/password/reset/confirm/', {
            token,
            new_password: newPassword
        });
        return response.data;
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

export const community = {
    getPosts: () => apiClient.get('/posts/'),
    createPost: (postData: NewPost) => apiClient.post('/posts/', postData),
    likePost: (postId: number) => apiClient.post(`/posts/${postId}/like/`),
    deletePost: (postId: number) => apiClient.delete(`/posts/${postId}/`),
    addComment: (postId: number, content: string) => apiClient.post(`/posts/${postId}/comments/`, { content }),
    deleteComment: (postId: number, commentId: number) => apiClient.delete(`/posts/${postId}/comments/${commentId}/`)
};

export default apiClient; 