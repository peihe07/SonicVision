import type { Notification } from '@/types/notification';
import axios from 'axios';
import { defineStore } from 'pinia';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

export const useNotificationStore = defineStore('notification', {
    state: (): NotificationState => ({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
    }),

    getters: {
        getNotifications: (state): Notification[] => state.notifications,
        getUnreadCount: (state): number => state.unreadCount,
        isLoading: (state): boolean => state.loading,
        getError: (state): string | null => state.error,
    },

    actions: {
        async fetchNotifications(): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get<Notification[]>('/api/notifications');
                this.notifications = response.data;
                this.unreadCount = response.data.filter(n => !n.isRead).length;
            } catch (error) {
                this.error = '獲取通知失敗';
                console.error('Error fetching notifications:', error);
            } finally {
                this.loading = false;
            }
        },

        async markAsRead(notificationId: number): Promise<void> {
            try {
                await axios.put(`/api/notifications/${notificationId}/read`);
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    this.unreadCount--;
                }
            } catch (error) {
                this.error = '標記通知已讀失敗';
                console.error('Error marking notification as read:', error);
            }
        },

        async markAllAsRead(): Promise<void> {
            try {
                await axios.put('/api/notifications/read-all');
                this.notifications.forEach(n => {
                    if (!n.isRead) {
                        n.isRead = true;
                    }
                });
                this.unreadCount = 0;
            } catch (error) {
                this.error = '標記所有通知已讀失敗';
                console.error('Error marking all notifications as read:', error);
            }
        },

        async deleteNotification(notificationId: number): Promise<void> {
            try {
                await axios.delete(`/api/notifications/${notificationId}`);
                const index = this.notifications.findIndex(n => n.id === notificationId);
                if (index !== -1) {
                    const notification = this.notifications[index];
                    if (!notification.isRead) {
                        this.unreadCount--;
                    }
                    this.notifications.splice(index, 1);
                }
            } catch (error) {
                this.error = '刪除通知失敗';
                console.error('Error deleting notification:', error);
            }
        },

        async clearAllNotifications(): Promise<void> {
            try {
                await axios.delete('/api/notifications');
                this.notifications = [];
                this.unreadCount = 0;
            } catch (error) {
                this.error = '清空通知失敗';
                console.error('Error clearing notifications:', error);
            }
        },

        // WebSocket 相關方法
        addNotification(notification: Notification): void {
            this.notifications.unshift(notification);
            if (!notification.isRead) {
                this.unreadCount++;
            }
        },
    },
}); 