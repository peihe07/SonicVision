import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sonicvision.uno/api',
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

// 響應攔截器，處理 token 過期
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (err) {
                // 刷新 token 失敗，清除所有 token 並重定向到登入頁
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const useAuthAPI = () => {
    const googleLogin = async (code: string) => {
        try {
            const response = await api.post('/api/auth/google/', {
                code: code,
                redirect_uri: `${window.location.origin}/auth/callback`
            });

            if (response.data.token) {
                localStorage.setItem('access_token', response.data.token);
            }
            if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
            }

            return response.data;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    return {
        googleLogin
    };
}; 