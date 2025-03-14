import type { ApiResponse, Movie, Music, NewPost } from '@/types';
import type { LoginCredentials, NotificationSettings, PasswordUpdateData, PrivacySettings, ProfileUpdateData, RegisterData, User } from '@/types/api';
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

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
    const token = localStorage.getItem('access_token');
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
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
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
        rating: 4.5,
        previewUrl: 'https://example.com/preview1.mp3',
        spotifyUrl: 'https://open.spotify.com/track/example1',
        youtubeUrl: 'https://www.youtube.com/watch?v=example1'
    },
    {
        id: 2,
        title: '模擬音樂 2',
        artist: '模擬藝術家 2',
        coverUrl: 'https://via.placeholder.com/300',
        rating: 4.3,
        previewUrl: 'https://example.com/preview2.mp3',
        spotifyUrl: 'https://open.spotify.com/track/example2',
        youtubeUrl: 'https://www.youtube.com/watch?v=example2'
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

export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        return apiClient.post('/token/', credentials);
    },
    register: async (userData: RegisterData) => {
        return apiClient.post('/auth/register/', userData);
    },
    refreshToken: async (refresh: string) => {
        return apiClient.post('/token/refresh/', { refresh });
    },
    forgotPassword: async (email: string) => {
        return apiClient.post('/auth/forgot-password/', { email });
    },
    logout: async () => {
        return apiClient.post('/auth/logout/');
    },
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get('/auth/profile/');
        return response.data;
    },
    updateProfile: async (profileData: ProfileUpdateData): Promise<User> => {
        const formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });
        const response = await apiClient.put('/auth/profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    updatePassword: async (passwordData: PasswordUpdateData) => {
        return apiClient.put('/auth/password/', passwordData);
    },
    updateNotificationSettings: async (settings: NotificationSettings) => {
        return apiClient.put('/auth/settings/notifications/', {
            email_notifications: settings.email_notifications,
            push_notifications: settings.push_notifications,
            post_interaction: settings.postInteraction
        });
    },
    updatePrivacySettings: async (settings: PrivacySettings) => {
        return apiClient.put('/auth/settings/privacy/', {
            profile_visibility: settings.profile_visibility,
            show_activity: settings.show_activity,
            searchable: settings.searchable
        });
    },
    deactivateAccount: async () => {
        return apiClient.post('/auth/deactivate/');
    },
    deleteAccount: async () => {
        return apiClient.delete('/auth/account/');
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