export interface Comment {
    id: number;
    author: string;
    authorAvatar: string;
    content: string;
    createdAt: Date;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    createdAt: Date;
    likes: number;
    category: string;
    comments: Comment[];
    showComments?: boolean;
} 