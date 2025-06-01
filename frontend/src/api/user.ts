import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 請求攔截器，添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface User {
    id: number;
    username: string;
    email: string;
}

export const userAPI = {
    // 獲取當前用戶信息
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/api/auth/profile/');
        return response.data;
    },

    // 通過郵箱查找用戶
    findByEmail: async (email: string): Promise<User> => {
        const response = await api.get<User>(`/api/users/find-by-email/`, {
            params: { email }
        });
        return response.data;
    }
}; 