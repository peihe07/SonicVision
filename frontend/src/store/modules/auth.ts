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
import { computed, ref } from 'vue';

interface GoogleLoginResponse {
    token: string;
    refresh: string;
    user: ApiUser;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<ApiUser | null>(null);
    const error = ref<string | null>(null);
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);

    const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

    const setUser = (user: ApiUser) => {
        user.value = user;
    };

    const setAccessToken = (token: string) => {
        accessToken.value = token;
        localStorage.setItem('access_token', token);
    };

    const setRefreshToken = (token: string) => {
        refreshToken.value = token;
        localStorage.setItem('refresh_token', token);
    };

    const clearTokens = () => {
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    const login = async (credentials: LoginCredentials) => {
        error.value = null;
        try {
            const response = await authAPI.login(credentials);
            if (response.data.access) {
                setAccessToken(response.data.access);
            }
            if (response.data.refresh) {
                setRefreshToken(response.data.refresh);
            }
            if (response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            error.value = error instanceof Error ? error.message : '登入失敗';
            throw error;
        }
    };

    const register = async (userData: { username: string; email: string; password: string }) => {
        error.value = null;
        try {
            const response = await authAPI.register(userData);
            if (response.data.access) {
                setAccessToken(response.data.access);
            }
            if (response.data.refresh) {
                setRefreshToken(response.data.refresh);
            }
            if (response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            error.value = error instanceof Error ? error.message : '註冊失敗';
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            clearTokens();
            user.value = null;
        } catch (error) {
            console.error('登出失敗:', error);
            throw error;
        }
    };

    const checkAuth = async () => {
        try {
            const user = await authAPI.getProfile();
            setUser(user);
        } catch (error) {
            user.value = null;
        }
    };

    const fetchUserProfile = async () => {
        try {
            const user = await authAPI.getProfile();
            setUser(user);
        } catch (error) {
            user.value = null;
            throw error;
        }
    };

    const updateProfile = async (profileData: ProfileUpdateData) => {
        error.value = null;
        try {
            const updatedUser = await authAPI.updateProfile(profileData);
            setUser(updatedUser);
        } catch (error) {
            error.value = '更新個人資料失敗';
            throw error;
        }
    };

    const googleLogin = async (code: string) => {
        error.value = null;
        try {
            const response = await authAPI.googleLogin(code);
            const data = response.data as GoogleLoginResponse;
            setUser(data.user);
        } catch (error) {
            error.value = '使用 Google 登入失敗';
            throw error;
        }
    };

    const updatePassword = async (passwordData: PasswordUpdateData) => {
        error.value = null;
        try {
            await authAPI.updatePassword(passwordData);
        } catch (error) {
            error.value = '更新密碼失敗';
            throw error;
        }
    };

    const updateNotificationSettings = async (settings: NotificationSettings) => {
        error.value = null;
        try {
            await authAPI.updateNotificationSettings(settings);
        } catch (error) {
            error.value = '更新通知設定失敗';
            throw error;
        }
    };

    const updatePrivacySettings = async (settings: PrivacySettings) => {
        error.value = null;
        try {
            await authAPI.updatePrivacySettings(settings);
        } catch (error) {
            error.value = '更新隱私設定失敗';
            throw error;
        }
    };

    const deactivateAccount = async () => {
        error.value = null;
        try {
            await authAPI.deactivateAccount();
            user.value = null;
        } catch (error) {
            error.value = '停用帳號失敗';
            throw error;
        }
    };

    const deleteAccount = async () => {
        error.value = null;
        try {
            await authAPI.deleteAccount();
            user.value = null;
        } catch (error) {
            error.value = '刪除帳號失敗';
            throw error;
        }
    };

    const handleSpotifyAuth = async () => {
        try {
            await fetchUserProfile();
        } catch (e) {
            console.error('處理 Spotify 授權時發生錯誤:', e);
            throw e;
        }
    };

    return {
        user,
        error,
        accessToken,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        register,
        fetchUserProfile,
        updateProfile,
        googleLogin,
        updatePassword,
        updateNotificationSettings,
        updatePrivacySettings,
        deactivateAccount,
        deleteAccount,
        handleSpotifyAuth
    };
}); 