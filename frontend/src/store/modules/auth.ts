import axios from 'axios';
import { defineStore } from 'pinia';

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        currentUser: null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.currentUser,
        getCurrentUser: (state): User | null => state.currentUser,
    },

    actions: {
        async login(email: string, password: string): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post<{ user: User }>('/api/auth/login', {
                    email,
                    password,
                });
                this.currentUser = response.data.user;
            } catch (error) {
                this.error = '登入失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(username: string, email: string, password: string): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post<{ user: User }>('/api/auth/register', {
                    username,
                    email,
                    password,
                });
                this.currentUser = response.data.user;
            } catch (error) {
                this.error = '註冊失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout(): Promise<void> {
            try {
                await axios.post('/api/auth/logout');
                this.currentUser = null;
            } catch (error) {
                this.error = '登出失敗';
                throw error;
            }
        },

        async fetchCurrentUser(): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get<{ user: User }>('/api/auth/me');
                this.currentUser = response.data.user;
            } catch (error) {
                this.currentUser = null;
                this.error = '獲取用戶信息失敗';
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(data: Partial<User>): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.put<{ user: User }>('/api/auth/profile', data);
                this.currentUser = response.data.user;
            } catch (error) {
                this.error = '更新個人資料失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
}); 