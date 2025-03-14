<template>
  <div class="community-page">
    <div class="community-header">
      <h1>社群討論</h1>
      <div class="search-bar">
        <v-text-field
          v-model="searchQuery"
          placeholder="搜尋貼文..."
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          @input="handleSearch"
        />
      </div>
      <v-btn
        color="primary"
        @click="openNewPostDialog"
      >
        發布貼文
      </v-btn>
    </div>

    <div class="filters">
      <v-select
        v-model="selectedCategory"
        :items="categories"
        label="分類"
        hide-details
      />
      <v-select
        v-model="sortBy"
        :items="sortOptions"
        label="排序"
        hide-details
      />
    </div>

    <div class="posts-list">
      <v-card
        v-for="post in filteredPosts"
        :key="post.id"
        class="post-card mb-4"
      >
        <v-card-title>
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-3">
              <v-img :src="post.authorAvatar" />
            </v-avatar>
            <div>
              <div class="text-h6">{{ post.title }}</div>
              <div class="text-subtitle-2">{{ post.author }}</div>
            </div>
          </div>
          <v-chip
            :color="getCategoryColor(post.category)"
            class="ml-auto"
            small
          >
            {{ post.category }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <div :class="{ 'text-truncate': !post.isExpanded }">
            {{ post.content }}
          </div>
          <v-btn
            text
            small
            color="primary"
            @click="togglePostExpansion(post)"
          >
            {{ post.isExpanded ? '收起' : '展開' }}
          </v-btn>
        </v-card-text>

        <v-card-actions>
          <v-btn
            text
            small
            :color="post.isLiked ? 'red' : ''"
            @click="likePost(post)"
          >
            <v-icon left>
              {{ post.isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
            {{ post.likes }}
          </v-btn>
          <v-btn text small>
            <v-icon left>mdi-comment-outline</v-icon>
            {{ post.comments.length }}
          </v-btn>
          <v-spacer />
          <span class="text-caption">
            {{ new Date(post.createdAt).toLocaleString() }}
          </span>
        </v-card-actions>
      </v-card>
    </div>

    <v-dialog
      v-model="newPostDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>發布新貼文</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmitPost">
            <v-text-field
              v-model="newPost.title"
              label="標題"
              required
            />
            <v-select
              v-model="newPost.category"
              :items="categories"
              label="分類"
              required
            />
            <v-textarea
              v-model="newPost.content"
              label="內容"
              required
              rows="5"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="newPostDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!validPost"
            @click="handleSubmitPost"
          >
            發布
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import { useCommunityStore } from '@/store/modules/community';
import type { NewPost, Post } from '@/types';
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'CommunityPage',
  setup() {
    const authStore = useAuthStore();
    const communityStore = useCommunityStore();
    const newPostDialog = ref(false);
    const newPost = ref<NewPost>({
      title: '',
      category: '全部',
      content: ''
    });

    const posts = computed(() => communityStore.posts);
    const isLoading = computed(() => communityStore.isLoading);
    const error = computed(() => communityStore.error);

    const selectedCategory = ref<string>('全部');
    const sortBy = ref<string>('最新');
    const searchQuery = ref<string>('');

    const categories = [
      '全部',
      '音樂',
      '電影',
      '討論',
      '分享',
      '其他'
    ];

    const sortOptions = [
      '最新',
      '最多讚',
      '最多評論'
    ];

    const validPost = computed(() => {
      return newPost.value.title.trim() !== '' && 
             newPost.value.category !== '' && 
             newPost.value.content.trim() !== '';
    });

    const filteredPosts = computed(() => {
      let result = [...posts.value];

      if (selectedCategory.value !== '全部') {
        result = result.filter(post => post.category === selectedCategory.value);
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
        );
      }

      switch (sortBy.value) {
        case '最多讚':
          result.sort((a, b) => b.likes - a.likes);
          break;
        case '最多評論':
          result.sort((a, b) => b.comments.length - a.comments.length);
          break;
        default:
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return result;
    });

    const handleSubmitPost = async () => {
      if (!validPost.value) return;

      try {
        const postData = {
          ...newPost.value,
          author: authStore.currentUser?.username || '',
          authorAvatar: typeof authStore.currentUser?.avatar === 'string' 
            ? authStore.currentUser.avatar 
            : '/avatars/default.jpg'
        };
        await communityStore.createPost(postData);
        newPostDialog.value = false;
        newPost.value = {
          title: '',
          category: '全部',
          content: ''
        };
      } catch (err) {
        console.error('發布貼文失敗:', err);
      }
    };

    const togglePostExpansion = (post: Post) => {
      post.isExpanded = !post.isExpanded;
    };

    const likePost = async (post: Post) => {
      try {
        await communityStore.likePost(post.id);
      } catch (err) {
        console.error('點讚失敗:', err);
      }
    };

    const handleSearch = (query: string) => {
      searchQuery.value = query;
    };

    const getCategoryColor = (category: string): string => {
      const colorMap: Record<string, string> = {
        '音樂': 'primary',
        '電影': 'secondary',
        '討論': 'info',
        '分享': 'success',
        '其他': 'warning'
      };
      return colorMap[category] || 'default';
    };

    const openNewPostDialog = () => {
      newPostDialog.value = true;
    };

    onMounted(async () => {
      await communityStore.fetchPosts();
    });

    return {
      newPost,
      newPostDialog,
      posts: filteredPosts,
      selectedCategory,
      sortBy,
      searchQuery,
      categories,
      sortOptions,
      filteredPosts,
      validPost,
      handleSubmitPost,
      togglePostExpansion,
      likePost,
      handleSearch,
      getCategoryColor,
      openNewPostDialog,
      isLoading,
      error
    };
  }
});
</script>

<style scoped>
.community-page {
  padding: 20px;
}

.community-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar {
  width: 300px;
  margin: 0 20px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.post-card {
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>