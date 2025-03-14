import { authAPI } from '@/services/api';
import type {
    User as ApiUser,
    LoginCredentials,
    NotificationSettings,
    PasswordUpdateData,
    PrivacySettings,
    ProfileUpdateData
} from '@/types/api';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        currentUser: null as ApiUser | null,
        token: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
        error: null as string | null
    }),

    getters: {
        isAuthenticated(): boolean {
            return !!this.token && !!this.currentUser;
        }
    },

    actions: {
        setUser(user: ApiUser | null) {
            this.currentUser = user;
        },

        setToken(token: string | null) {
            this.token = token;
            if (token) {
                localStorage.setItem('access_token', token);
            } else {
                localStorage.removeItem('access_token');
            }
        },

        async login(credentials: LoginCredentials) {
            this.error = null;
            try {
                const response = await authAPI.login(credentials);
                const { access, refresh } = response.data;
                this.setToken(access);
                localStorage.setItem('refresh_token', refresh);
                await this.fetchUserProfile();
            } catch (error) {
                this.error = '登入失敗';
                throw error;
            }
        },

        async logout() {
            try {
                await authAPI.logout();
            } catch (error) {
                console.error('登出時發生錯誤:', error);
            } finally {
                this.setToken(null);
                this.setUser(null);
                localStorage.removeItem('refresh_token');
            }
        },

        async fetchUserProfile() {
            try {
                const user = await authAPI.getProfile();
                this.setUser(user);
            } catch (error) {
                this.setToken(null);
                throw error;
            }
        },

        async updateProfile(profileData: ProfileUpdateData) {
            this.error = null;
            try {
                const updatedUser = await authAPI.updateProfile(profileData);
                this.setUser(updatedUser);
            } catch (error) {
                this.error = '更新個人資料失敗';
                throw error;
            }
        },

        async register(userData: { username: string; email: string; password: string }) {
            this.error = null;
            try {
                const response = await authAPI.register(userData);
                this.setToken(response.data.access);
                this.setUser(response.data.user);
            } catch (error) {
                this.error = '註冊失敗';
                throw error;
            }
        },

        async updatePassword(passwordData: PasswordUpdateData) {
            this.error = null;
            try {
                await authAPI.updatePassword(passwordData);
            } catch (error) {
                this.error = '更新密碼失敗';
                throw error;
            }
        },

        async updateNotificationSettings(settings: NotificationSettings) {
            this.error = null;
            try {
                await authAPI.updateNotificationSettings(settings);
            } catch (error) {
                this.error = '更新通知設定失敗';
                throw error;
            }
        },

        async updatePrivacySettings(settings: PrivacySettings) {
            this.error = null;
            try {
                await authAPI.updatePrivacySettings(settings);
            } catch (error) {
                this.error = '更新隱私設定失敗';
                throw error;
            }
        },

        async deactivateAccount() {
            this.error = null;
            try {
                await authAPI.deactivateAccount();
                this.setToken(null);
                this.setUser(null);
            } catch (error) {
                this.error = '停用帳號失敗';
                throw error;
            }
        },

        async deleteAccount() {
            this.error = null;
            try {
                await authAPI.deleteAccount();
                this.setToken(null);
                this.setUser(null);
            } catch (error) {
                this.error = '刪除帳號失敗';
                throw error;
            }
        },

        async checkAuth() {
            if (this.token) {
                try {
                    await this.fetchUserProfile();
                } catch (error) {
                    this.setToken(null);
                    this.setUser(null);
                }
            }
        }
    }
}); 