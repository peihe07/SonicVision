import { auth } from '@/services/api';
import { defineStore } from 'pinia';

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string | File;  // 修改為可以接受 string 或 File 類型
    bio?: string;
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
        setToken(token: string | null) {
            this.token = token;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        },

        setUser(user: User | null) {
            this.user = user;
        },

        async login(credentials: { username: string; password: string }) {
            this.loading = true;
            this.error = null;
            try {
                const response = await auth.login(credentials);
                this.setToken(response.token);
                this.setUser(response.user);
            } catch (error) {
                this.error = '登入失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(userData: { username: string; email: string; password: string }) {
            this.loading = true;
            this.error = null;
            try {
                const response = await auth.register(userData);
                this.setToken(response.token);
                this.setUser(response.user);
            } catch (error) {
                this.error = '註冊失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await auth.logout();
            } catch (error) {
                console.error('登出時發生錯誤:', error);
            } finally {
                this.setToken(null);
                this.setUser(null);
            }
        },

        async checkAuth() {
            if (!this.token) return;

            try {
                const user = await auth.getProfile();
                this.setUser(user);
            } catch (error) {
                this.setToken(null);
                this.setUser(null);
            }
        },

        async updateProfile(profileData: Partial<User> & { avatar?: File }) {
            this.loading = true;
            this.error = null;
            try {
                const updatedUser = await auth.updateProfile(profileData);
                this.setUser(updatedUser);
            } catch (error) {
                this.error = '更新個人資料失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
            this.loading = true;
            this.error = null;
            try {
                await auth.updatePassword(passwordData);
            } catch (error) {
                this.error = '更新密碼失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateNotificationSettings(settings: {
            email: boolean;
            newFollower: boolean;
            postInteraction: boolean;
        }) {
            this.loading = true;
            this.error = null;
            try {
                await auth.updateNotificationSettings(settings);
            } catch (error) {
                this.error = '更新通知設定失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updatePrivacySettings(settings: {
            publicProfile: boolean;
            showActivity: boolean;
            searchable: boolean;
        }) {
            this.loading = true;
            this.error = null;
            try {
                await auth.updatePrivacySettings(settings);
            } catch (error) {
                this.error = '更新隱私設定失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deactivateAccount() {
            this.loading = true;
            this.error = null;
            try {
                await auth.deactivateAccount();
                this.setToken(null);
                this.setUser(null);
            } catch (error) {
                this.error = '停用帳號失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteAccount() {
            this.loading = true;
            this.error = null;
            try {
                await auth.deleteAccount();
                this.setToken(null);
                this.setUser(null);
            } catch (error) {
                this.error = '刪除帳號失敗';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
}); 