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

interface GoogleLoginResponse {
    token: string;
    refresh: string;
    user: ApiUser;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as ApiUser | null,
        error: null as string | null,
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user && !!state.accessToken
    },

    actions: {
        setUser(user: ApiUser) {
            this.user = user;
        },

        setAccessToken(token: string) {
            this.accessToken = token;
            localStorage.setItem('access_token', token);
        },

        setRefreshToken(token: string) {
            this.refreshToken = token;
            localStorage.setItem('refresh_token', token);
        },

        clearTokens() {
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },

        async login(credentials: LoginCredentials) {
            this.error = null;
            try {
                const response = await authAPI.login(credentials);
                if (response.data.access) {
                    this.setAccessToken(response.data.access);
                }
                if (response.data.refresh) {
                    this.setRefreshToken(response.data.refresh);
                }
                if (response.data.user) {
                    this.setUser(response.data.user);
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : '登入失敗';
                throw error;
            }
        },

        async register(userData: { username: string; email: string; password: string }) {
            this.error = null;
            try {
                const response = await authAPI.register(userData);
                if (response.data.access) {
                    this.setAccessToken(response.data.access);
                }
                if (response.data.refresh) {
                    this.setRefreshToken(response.data.refresh);
                }
                if (response.data.user) {
                    this.setUser(response.data.user);
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : '註冊失敗';
                throw error;
            }
        },

        async logout() {
            try {
                await authAPI.logout();
                this.clearTokens();
                this.user = null;
            } catch (error) {
                console.error('登出失敗:', error);
                throw error;
            }
        },

        async checkAuth() {
            try {
                const user = await authAPI.getProfile();
                this.setUser(user);
            } catch (error) {
                this.user = null;
            }
        },

        async fetchUserProfile() {
            try {
                const user = await authAPI.getProfile();
                this.setUser(user);
            } catch (error) {
                this.user = null;
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

        async googleLogin(code: string) {
            this.error = null;
            try {
                const response = await authAPI.googleLogin(code);
                const data = response.data as GoogleLoginResponse;
                this.setUser(data.user);
            } catch (error) {
                this.error = '使用 Google 登入失敗';
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
                this.user = null;
            } catch (error) {
                this.error = '停用帳號失敗';
                throw error;
            }
        },

        async deleteAccount() {
            this.error = null;
            try {
                await authAPI.deleteAccount();
                this.user = null;
            } catch (error) {
                this.error = '刪除帳號失敗';
                throw error;
            }
        }
    }
}); 