import type { Comment, Post } from '@/types/community';
import axios from 'axios';
import { defineStore } from 'pinia';

interface CommunityState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

export const useCommunityStore = defineStore('community', {
    state: (): CommunityState => ({
        posts: [],
        loading: false,
        error: null,
    }),

    getters: {
        getPosts: (state: CommunityState): Post[] => state.posts,
        getPostById: (state: CommunityState) => (id: number): Post | undefined =>
            state.posts.find((post: Post) => post.id === id),
        isLoading: (state: CommunityState): boolean => state.loading,
        getError: (state: CommunityState): string | null => state.error,
    },

    actions: {
        async fetchPosts(): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get<Post[]>('/api/posts');
                this.posts = response.data;
            } catch (error) {
                this.error = '獲取貼文失敗';
                console.error('Error fetching posts:', error);
            } finally {
                this.loading = false;
            }
        },

        async createPost(post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post<Post>('/api/posts', post);
                this.posts.unshift(response.data);
            } catch (error) {
                this.error = '創建貼文失敗';
                console.error('Error creating post:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async likePost(postId: number): Promise<void> {
            try {
                await axios.post(`/api/posts/${postId}/like`);
                const post = this.posts.find((p: Post) => p.id === postId);
                if (post) {
                    post.likes++;
                }
            } catch (error) {
                this.error = '點讚失敗';
                console.error('Error liking post:', error);
            }
        },

        async addComment(postId: number, content: string): Promise<void> {
            try {
                const response = await axios.post<Comment>(`/api/posts/${postId}/comments`, { content });
                const post = this.posts.find((p: Post) => p.id === postId);
                if (post) {
                    post.comments.push(response.data);
                }
            } catch (error) {
                this.error = '評論失敗';
                console.error('Error adding comment:', error);
                throw error;
            }
        },

        async deletePost(postId: number): Promise<void> {
            try {
                await axios.delete(`/api/posts/${postId}`);
                this.posts = this.posts.filter((p: Post) => p.id !== postId);
            } catch (error) {
                this.error = '刪除貼文失敗';
                console.error('Error deleting post:', error);
                throw error;
            }
        },

        async deleteComment(postId: number, commentId: number): Promise<void> {
            try {
                await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
                const post = this.posts.find((p: Post) => p.id === postId);
                if (post) {
                    post.comments = post.comments.filter((c: Comment) => c.id !== commentId);
                }
            } catch (error) {
                this.error = '刪除評論失敗';
                console.error('Error deleting comment:', error);
                throw error;
            }
        },
    },
}); 