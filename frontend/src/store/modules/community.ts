import { community } from '@/services/api';
import type { NewPost, Post } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommunityStore = defineStore('community', () => {
    const posts = ref<Post[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchPosts = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await community.getPosts();
            posts.value = response.data;
        } catch (err) {
            error.value = '獲取貼文列表失敗';
            console.error('獲取貼文列表失敗:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const createPost = async (postData: NewPost) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await community.createPost(postData);
            posts.value.unshift(response.data);
            return response.data;
        } catch (err) {
            error.value = '發布貼文失敗';
            console.error('發布貼文失敗:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const likePost = async (postId: number) => {
        try {
            await community.likePost(postId);
            const post = posts.value.find(p => p.id === postId);
            if (post) {
                post.isLiked = !post.isLiked;
                post.likes += post.isLiked ? 1 : -1;
            }
        } catch (err) {
            error.value = '點讚失敗';
            console.error('點讚失敗:', err);
            throw err;
        }
    };

    const deletePost = async (postId: number) => {
        try {
            await community.deletePost(postId);
            posts.value = posts.value.filter(p => p.id !== postId);
        } catch (err) {
            error.value = '刪除貼文失敗';
            console.error('刪除貼文失敗:', err);
            throw err;
        }
    };

    return {
        posts,
        isLoading,
        error,
        fetchPosts,
        createPost,
        likePost,
        deletePost
    };
}); 