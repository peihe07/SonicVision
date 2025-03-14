export interface Notification {
    id: number;
    type: 'like' | 'comment' | 'follow' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    link?: string;
    sender?: {
        id: number;
        username: string;
        avatar: string;
    };
} 