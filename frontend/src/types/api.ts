const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface NewPost {
    title: string;
    content: string;
    category: string;
    media_url?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
}

export interface ProfileUpdateData {
    username?: string;
    email?: string;
    bio?: string;
    avatar?: File;
}

export interface PasswordUpdateData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface NotificationSettings {
    email_notifications: boolean;
    push_notifications: boolean;
    postInteraction: boolean;
}

export interface PrivacySettings {
    profile_visibility: 'public' | 'private';
    show_activity: boolean;
    searchable: boolean;
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
            code?: string;
            errors?: Record<string, string[]>;
        };
        status?: number;
        statusText?: string;
    };
    message: string;
}