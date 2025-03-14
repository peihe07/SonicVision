<template>
  <div class="community-page">
    <v-container>
      <!-- 頁面標題和發帖按鈕 -->
      <v-row class="mb-6">
        <v-col cols="8">
          <h1 class="text-h4">社群討論區</h1>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-btn
            color="primary"
            @click="openNewPostDialog"
          >
            發布新貼文
          </v-btn>
        </v-col>
      </v-row>

      <!-- 篩選和排序 -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="searchQuery"
            label="搜尋貼文"
            prepend-icon="mdi-magnify"
            outlined
            dense
            clearable
            @input="handleSearch"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="分類"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="排序方式"
            outlined
            dense
          ></v-select>
        </v-col>
      </v-row>

      <!-- 分類標籤 -->
      <v-row class="mb-4">
        <v-col>
          <v-chip-group>
            <v-chip
              v-for="category in categories"
              :key="category.value"
              :color="selectedCategory === category.value ? 'primary' : 'default'"
              @click="selectedCategory = category.value"
              :outlined="selectedCategory !== category.value"
            >
              {{ category.text }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <!-- 載入中提示 -->
      <v-row v-if="store.isLoading">
        <v-col class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <!-- 錯誤提示 -->
      <v-row v-if="store.getError">
        <v-col>
          <v-alert
            type="error"
            dismissible
          >
            {{ store.getError }}
          </v-alert>
        </v-col>
      </v-row>

      <!-- 貼文列表 -->
      <v-row v-if="!store.isLoading">
        <v-col cols="12">
          <v-card
            v-for="post in filteredPosts"
            :key="post.id"
            class="mb-4 post-card"
            :class="{ 'post-card--hover': !post.isExpanded }"
          >
            <v-card-title>
              <v-row align="center">
                <v-col cols="auto">
                  <v-avatar size="40">
                    <v-img :src="post.authorAvatar"></v-img>
                  </v-avatar>
                </v-col>
                <v-col>
                  <div class="d-flex align-center">
                    <span class="text-h6 mr-2">{{ post.title }}</span>
                    <v-chip
                      x-small
                      :color="getCategoryColor(post.category)"
                      class="ml-2"
                    >
                      {{ getCategoryText(post.category) }}
                    </v-chip>
                  </div>
                  <div class="text-caption grey--text">
                    由 {{ post.author }} 發布於 {{ formatDate(post.createdAt) }}
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <div v-if="post.content.length > 200 && !post.isExpanded">
                {{ post.content.substring(0, 200) }}...
                <v-btn
                  text
                  small
                  color="primary"
                  @click="expandPost(post)"
                >
                  閱讀更多
                </v-btn>
              </div>
              <div v-else>
                {{ post.content }}
                <v-btn
                  v-if="post.content.length > 200"
                  text
                  small
                  color="primary"
                  @click="collapsePost(post)"
                >
                  收起
                </v-btn>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="likePost(post.id)"
                :class="{ 'liked': post.isLiked }"
              >
                <v-icon left>mdi-thumb-up</v-icon>
                {{ post.likes }}
              </v-btn>
              <v-btn
                text
                @click="showComments(post.id)"
                :class="{ 'active': post.showComments }"
              >
                <v-icon left>mdi-comment</v-icon>
                {{ post.comments.length }} 評論
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="isCurrentUserPost(post)"
                icon
                small
                @click="deletePost(post.id)"
                class="delete-btn"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
            
            <!-- 評論區域 -->
            <v-expand-transition>
              <div v-if="post.showComments">
                <v-divider></v-divider>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="comment in post.comments"
                      :key="comment.id"
                    >
                      <v-list-item-avatar>
                        <v-img :src="comment.authorAvatar"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ comment.author }}</v-list-item-title>
                        <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
                        <div class="text-caption grey--text">{{ formatDate(comment.createdAt) }}</div>
                      </v-list-item-content>
                      <v-list-item-action v-if="isCurrentUserComment(comment)">
                        <v-btn
                          icon
                          x-small
                          @click="deleteComment(post.id, comment.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  
                  <!-- 新增評論 -->
                  <v-text-field
                    v-model="newComments[post.id]"
                    label="發表評論"
                    append-outer-icon="mdi-send"
                    @click:append-outer="addComment(post.id)"
                    @keyup.enter="addComment(post.id)"
                  ></v-text-field>
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 發布新貼文對話框 -->
    <v-dialog
      v-model="newPostDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>發布新貼文</v-card-title>
        <v-card-text>
          <v-form ref="postForm" v-model="validPost">
            <v-text-field
              v-model="newPost.title"
              label="標題"
              :rules="[(v: string) => !!v || '請輸入標題']"
              required
            ></v-text-field>
            <v-select
              v-model="newPost.category"
              :items="categories"
              label="分類"
              :rules="[(v: string) => !!v || '請選擇分類']"
              required
            ></v-select>
            <v-textarea
              v-model="newPost.content"
              label="內容"
              :rules="[(v: string) => !!v || '請輸入內容']"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="newPostDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            @click="submitPost"
            :disabled="!validPost"
          >
            發布
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 登入提示對話框 -->
    <v-dialog
      v-model="showLoginPrompt"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          需要登入
        </v-card-title>
        <v-card-text>
          請先登入您的帳號才能發布貼文。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="showLoginPrompt = false"
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useAuthStore } from '../store/modules/auth';
import { useCommunityStore } from '../store/modules/community';
import type { Comment, Post } from '../types/community';

export default defineComponent({
  name: 'CommunityPage',
  
  setup() {
    const store = useCommunityStore();
    const authStore = useAuthStore();
    const selectedCategory = ref('全部');
    const sortBy = ref('最新');
    const searchQuery = ref('');
    const newPostDialog = ref(false);
    const validPost = ref(false);
    const newComments = ref<Record<number, string>>({});
    const showLoginPrompt = ref(false);

    const categories = [
      '全部',
      '電影討論',
      '音樂討論',
      '心得分享',
      '尋片互助'
    ];

    const sortOptions = [
      '最新',
      '最多讚',
      '最多評論'
    ];

    const newPost = ref({
      title: '',
      category: '',
      content: '',
      author: authStore.currentUser?.username || '',
      authorAvatar: authStore.currentUser?.avatar || '/avatars/default.jpg'
    });

    const filteredPosts = computed(() => {
      let posts = store.getPosts;
      
      // 搜尋篩選
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query)
        );
      }
      
      // 分類篩選
      if (selectedCategory.value !== '全部') {
        posts = posts.filter(post => {
          switch (selectedCategory.value) {
            case '電影討論':
              return post.category === 'movies';
            case '音樂討論':
              return post.category === 'music';
            case '心得分享':
              return post.category === 'experience';
            case '尋片互助':
              return post.category === 'help';
            default:
              return true;
          }
        });
      }

      // 排序
      switch (sortBy.value) {
        case '最新':
          return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case '最多讚':
          return [...posts].sort((a, b) => b.likes - a.likes);
        case '最多評論':
          return [...posts].sort((a, b) => b.comments.length - a.comments.length);
        default:
          return posts;
      }
    });

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString('zh-TW');
    };

    const openNewPostDialog = () => {
      if (!authStore.isAuthenticated) {
        showLoginPrompt.value = true;
        return;
      }
      newPostDialog.value = true;
    };

    const submitPost = async () => {
      if (!validPost.value) return;

      try {
        const postData = {
          title: newPost.value.title,
          category: getCategoryValue(newPost.value.category),
          content: newPost.value.content,
          author: authStore.currentUser?.username || '',
          authorAvatar: authStore.currentUser?.avatar || '/avatars/default.jpg'
        };
        await store.createPost(postData);
        newPostDialog.value = false;
        newPost.value = {
          title: '',
          category: '',
          content: '',
          author: authStore.currentUser?.username || '',
          authorAvatar: authStore.currentUser?.avatar || '/avatars/default.jpg'
        };
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    };

    const getCategoryValue = (categoryText: string): string => {
      switch (categoryText) {
        case '電影討論':
          return 'movies';
        case '音樂討論':
          return 'music';
        case '心得分享':
          return 'experience';
        case '尋片互助':
          return 'help';
        default:
          return '';
      }
    };

    const likePost = async (postId: number) => {
      try {
        await store.likePost(postId);
      } catch (error) {
        console.error('Failed to like post:', error);
      }
    };

    const showComments = (postId: number) => {
      const post = store.getPostById(postId);
      if (post) {
        post.showComments = !post.showComments;
      }
    };

    const addComment = async (postId: number) => {
      const content = newComments.value[postId];
      if (!content) return;

      try {
        await store.addComment(postId, content);
        newComments.value[postId] = '';
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    };

    const deletePost = async (postId: number) => {
      try {
        await store.deletePost(postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    };

    const deleteComment = async (postId: number, commentId: number) => {
      try {
        await store.deleteComment(postId, commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    };

    const isCurrentUserPost = (post: Post) => {
      return post.author === authStore.currentUser?.username;
    };

    const isCurrentUserComment = (comment: Comment) => {
      return comment.author === authStore.currentUser?.username;
    };

    const handleSearch = () => {
      // 可以添加防抖處理
      if (searchQuery.value) {
        store.fetchPosts();
      }
    };

    const getCategoryColor = (category: string): string => {
      switch (category) {
        case 'movies':
          return 'red';
        case 'music':
          return 'blue';
        case 'experience':
          return 'green';
        case 'help':
          return 'orange';
        default:
          return 'grey';
      }
    };

    const getCategoryText = (category: string): string => {
      switch (category) {
        case 'movies':
          return '電影討論';
        case 'music':
          return '音樂討論';
        case 'experience':
          return '心得分享';
        case 'help':
          return '尋片互助';
        default:
          return '其他';
      }
    };

    const expandPost = (post: Post) => {
      post.isExpanded = true;
    };

    const collapsePost = (post: Post) => {
      post.isExpanded = false;
    };

    onMounted(async () => {
      await store.fetchPosts();
    });

    return {
      store,
      selectedCategory,
      sortBy,
      searchQuery,
      categories,
      sortOptions,
      newPostDialog,
      validPost,
      newPost,
      filteredPosts,
      newComments,
      formatDate,
      openNewPostDialog,
      submitPost,
      likePost,
      showComments,
      addComment,
      deletePost,
      deleteComment,
      isCurrentUserPost,
      isCurrentUserComment,
      handleSearch,
      getCategoryColor,
      getCategoryText,
      expandPost,
      collapsePost,
      showLoginPrompt,
    };
  }
});
</script>

<style scoped>
.community-page {
  padding: 20px 0;
}

.v-chip-group {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
}

.v-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: translateY(-2px);
}

.post-card {
  transition: all 0.3s ease;
}

.post-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.liked {
  color: #e91e63;
}

.active {
  color: #2196f3;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-card:hover .delete-btn {
  opacity: 1;
}

.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.3s ease;
}

.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>