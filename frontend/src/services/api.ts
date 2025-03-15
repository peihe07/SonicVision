import type { ApiResponse, Movie, Music, NewPost } from '@/types';
import type { LoginCredentials, NotificationSettings, PasswordUpdateData, PrivacySettings, ProfileUpdateData, RegisterData, User } from '@/types/api';
import type { AxiosError } from 'axios';
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

// 創建 axios 實例
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true,  // 允許跨域請求攜帶 cookie
});

// 獲取 CSRF Token
const getCsrfToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// 請求攔截器
apiClient.interceptors.request.use(
    async (config) => {
        // 對於非 GET 請求，先獲取 CSRF token
        if (config.method !== 'get') {
            try {
                // 先發送一個 GET 請求來獲取 CSRF token
                await axios.get(`${API_BASE_URL}/csrf-token/`, {
                    withCredentials: true
                });
            } catch (error) {
                console.warn('獲取 CSRF token 失敗:', error);
            }
        }

        // 添加 CSRF Token
        const token = getCsrfToken();
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }

        // 添加 JWT Token
        const jwtToken = localStorage.getItem('token');
        if (jwtToken) {
            config.headers['Authorization'] = `Bearer ${jwtToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 響應攔截器
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403) {
            console.error('CSRF 驗證失敗，請重新整理頁面');
            // 清除本地存儲的 token
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            // 重新導向到登入頁面
            window.location.href = '/login';
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
        try {
            const response = await apiClient.post('/token/', credentials);
            // 保存 token
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
            }
            if (response.data.refresh) {
                localStorage.setItem('refreshToken', response.data.refresh);
            }
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('用戶名或密碼錯誤');
            }
            throw error;
        }
    },
    googleLogin: async (accessToken: string) => {
        try {
            const response = await apiClient.post('/auth/google/', { access_token: accessToken });
            // 保存 token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.refresh) {
                localStorage.setItem('refreshToken', response.data.refresh);
            }
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 400) {
                throw new Error('Google 登入失敗：無效的 token');
            }
            throw error;
        }
    },
    register: async (userData: RegisterData) => {
        try {
            const response = await apiClient.post('/auth/register/', userData);
            // 保存 token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 400) {
                throw new Error('註冊失敗：用戶名已存在');
            }
            throw error;
        }
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
            const response = await apiClient.get('/playlists/');
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以查看歌單');
            }
            throw error;
        }
    },
    getById: async (id: number) => {
        try {
            const response = await apiClient.get(`/playlists/${id}/`);
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 404) {
                throw new Error('歌單不存在');
            }
            throw error;
        }
    },
    create: async (formData: FormData) => {
        try {
            const response = await apiClient.post('/playlists/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以創建歌單');
            }
            throw error;
        }
    },
    update: async (id: number, formData: FormData) => {
        try {
            const response = await apiClient.put(`/playlists/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以更新歌單');
            }
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            const response = await apiClient.delete(`/playlists/${id}/`);
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以刪除歌單');
            }
            throw error;
        }
    },
    searchSongs: async (query: string) => {
        try {
            const response = await apiClient.get('/spotify/search/', {
                params: { q: query, type: 'track' }
            });
            return response;
        } catch (error) {
            console.error('搜索歌曲失敗:', error);
            throw error;
        }
    },
    addSong: async (playlistId: number, songId: string) => {
        try {
            const response = await apiClient.post(`/playlists/${playlistId}/songs/`, {
                song_id: songId
            });
            return response;
        } catch (error) {
            console.error('添加歌曲失敗:', error);
            throw error;
        }
    },
    removeSong: async (playlistId: number, songId: string) => {
        try {
            const response = await apiClient.delete(`/playlists/${playlistId}/songs/${songId}/`);
            return response;
        } catch (error) {
            console.error('移除歌曲失敗:', error);
            throw error;
        }
    }
};

export const watchlists = {
    getAll: async () => {
        try {
            const response = await apiClient.get('/watchlists/');
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以查看片單');
            }
            throw error;
        }
    },
    getById: async (id: number) => {
        try {
            const response = await apiClient.get(`/watchlists/${id}/`);
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 404) {
                throw new Error('片單不存在');
            }
            throw error;
        }
    },
    create: async (formData: FormData) => {
        try {
            const response = await apiClient.post('/watchlists/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以創建片單');
            }
            throw error;
        }
    },
    update: async (id: number, formData: FormData) => {
        try {
            const response = await apiClient.put(`/watchlists/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以更新片單');
            }
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            const response = await apiClient.delete(`/watchlists/${id}/`);
            return response;
        } catch (error: unknown) {
            if ((error as AxiosError)?.response?.status === 401) {
                throw new Error('請先登入以刪除片單');
            }
            throw error;
        }
    },
    searchMovies: async (query: string) => {
        try {
            const response = await apiClient.get('/movies/search/', {
                params: { q: query }
            });
            return response;
        } catch (error) {
            console.error('搜索電影失敗:', error);
            throw error;
        }
    },
    addMovie: async (watchlistId: number, movieId: string) => {
        try {
            const response = await apiClient.post(`/watchlists/${watchlistId}/movies/`, {
                movie_id: movieId
            });
            return response;
        } catch (error) {
            console.error('添加電影失敗:', error);
            throw error;
        }
    },
    removeMovie: async (watchlistId: number, movieId: string) => {
        try {
            const response = await apiClient.delete(`/watchlists/${watchlistId}/movies/${movieId}/`);
            return response;
        } catch (error) {
            console.error('移除電影失敗:', error);
            throw error;
        }
    },
    toggleWatched: async (watchlistId: number, movieId: string) => {
        try {
            const response = await apiClient.post(`/watchlists/${watchlistId}/movies/${movieId}/toggle-watched/`);
            return response;
        } catch (error) {
            console.error('更新觀看狀態失敗:', error);
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
    getPosts: async () => {
        try {
            const response = await apiClient.get('/posts/');
            return response.data;
        } catch (error) {
            console.error('獲取貼文列表失敗:', error);
            throw error;
        }
    },
    createPost: async (postData: NewPost) => {
        try {
            const response = await apiClient.post('/posts/', postData);
            return response.data;
        } catch (error: unknown) {
            console.error('發布貼文失敗:', error);
            if ((error as AxiosError)?.response?.status === 403) {
                throw new Error('您沒有權限發布貼文，請先登入');
            }
            throw error;
        }
    },
    likePost: async (postId: number) => {
        try {
            const response = await apiClient.post(`/posts/${postId}/like/`);
            return response.data;
        } catch (error: unknown) {
            console.error('點讚失敗:', error);
            if ((error as AxiosError)?.response?.status === 403) {
                throw new Error('您沒有權限點讚，請先登入');
            }
            throw error;
        }
    },
    deletePost: async (postId: number) => {
        try {
            const response = await apiClient.delete(`/posts/${postId}/`);
            return response.data;
        } catch (error: unknown) {
            console.error('刪除貼文失敗:', error);
            if ((error as AxiosError)?.response?.status === 403) {
                throw new Error('您沒有權限刪除貼文');
            }
            throw error;
        }
    },
    addComment: async (postId: number, content: string) => {
        try {
            const response = await apiClient.post(`/posts/${postId}/comments/`, { content });
            return response.data;
        } catch (error: unknown) {
            console.error('發表評論失敗:', error);
            if ((error as AxiosError)?.response?.status === 403) {
                throw new Error('您沒有權限發表評論，請先登入');
            }
            throw error;
        }
    },
    deleteComment: async (postId: number, commentId: number) => {
        try {
            const response = await apiClient.delete(`/posts/${postId}/comments/${commentId}/`);
            return response.data;
        } catch (error: unknown) {
            console.error('刪除評論失敗:', error);
            if ((error as AxiosError)?.response?.status === 403) {
                throw new Error('您沒有權限刪除評論');
            }
            throw error;
        }
    }
};

export default apiClient; 