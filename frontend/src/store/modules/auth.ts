import { auth } from '@/services/api';
import { defineStore } from 'pinia';

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;  // 可選的頭像 URL
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.token && !!state.user,
        currentUser: (state): User | null => state.user,
    },

    actions: {
        setToken(token: string) {
            this.token = token;
            localStorage.setItem('token', token);
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },

        async login(username: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await auth.login(username, password);
                const token = response.access || response.token;
                if (!token) {
                    throw new Error('未收到有效的訪問令牌');
                }

                this.setToken(token);

                await this.fetchUserProfile();

                return response;
            } catch (error) {
                this.error = '登入失敗，請檢查您的憑證';
                this.clearAuth();
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await auth.logout?.();
            } catch (error) {
                console.error('登出時發生錯誤:', error);
            } finally {
                this.clearAuth();
            }
        },

        async fetchUserProfile() {
            try {
                const response = await auth.getProfile();
                this.user = response;
            } catch (error) {
                this.clearAuth();
                throw error;
            }
        },

        async checkAuth() {
            if (this.token && !this.user) {
                await this.fetchUserProfile();
            }
        },

        async updateProfile(userData: Partial<User>) {
            this.loading = true;
            this.error = null;
            try {
                const response = await auth.updateProfile(userData);
                this.user = response;
                return response;
            } catch (error) {
                this.error = '更新個人資料失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
}); 