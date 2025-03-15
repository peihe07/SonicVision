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
        currentUser: null as ApiUser | null,
        isAuthenticated: false,
        error: null as string | null
    }),

    actions: {
        setUser(user: ApiUser | null) {
            this.currentUser = user;
            this.isAuthenticated = !!user;
        },

        async login(credentials: LoginCredentials) {
            this.error = null;
            try {
                const response = await authAPI.login(credentials);
                if (response.data.user) {
                    this.setUser(response.data.user);
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : '登入失敗';
                throw error;
            }
        },

        async logout() {
            try {
                await authAPI.logout();
            } catch (error) {
                console.error('登出時發生錯誤:', error);
            } finally {
                this.setUser(null);
            }
        },

        async register(userData: { username: string; email: string; password: string }) {
            this.error = null;
            try {
                const response = await authAPI.register(userData);
                if (response.data.user) {
                    this.setUser(response.data.user);
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : '註冊失敗';
                throw error;
            }
        },

        async checkAuth() {
            try {
                const user = await authAPI.getProfile();
                this.setUser(user);
            } catch (error) {
                this.setUser(null);
            }
        },

        async fetchUserProfile() {
            try {
                const user = await authAPI.getProfile();
                this.setUser(user);
            } catch (error) {
                this.setUser(null);
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
                this.setUser(null);
            } catch (error) {
                this.error = '刪除帳號失敗';
                throw error;
            }
        }
    }
}); 