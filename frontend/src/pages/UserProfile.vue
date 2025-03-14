<template>
  <div class="user-profile">
    <v-container>
      <v-row>
        <!-- 左側個人資料卡片 -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text class="text-center">
              <v-avatar size="150" class="mb-4">
                <v-img
                  :src="user.avatar || '/avatars/default.jpg'"
                  alt="用戶頭像"
                ></v-img>
              </v-avatar>
              <h2 class="text-h5 mb-2">{{ user.username }}</h2>
              <p class="text-body-1 grey--text">{{ user.email }}</p>
              
              <!-- 編輯按鈕 -->
              <v-btn
                v-if="isCurrentUser"
                color="primary"
                outlined
                class="mt-4"
                @click="editDialog = true"
              >
                編輯個人資料
              </v-btn>
            </v-card-text>

            <!-- 用戶統計資訊 -->
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>發布貼文</v-list-item-title>
                  <v-list-item-subtitle>{{ userStats.posts }} 篇</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>收到讚</v-list-item-title>
                  <v-list-item-subtitle>{{ userStats.likes }} 個</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>評論數</v-list-item-title>
                  <v-list-item-subtitle>{{ userStats.comments }} 條</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- 右側內容區域 -->
        <v-col cols="12" md="8">
          <!-- 頁籤選單 -->
          <v-tabs v-model="activeTab" background-color="transparent" grow>
            <v-tab>最近活動</v-tab>
            <v-tab>我的貼文</v-tab>
            <v-tab>收藏列表</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <!-- 最近活動 -->
            <v-tab-item>
              <v-timeline dense class="mt-4">
                <v-timeline-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :color="getActivityColor(activity.type)"
                  small
                >
                  <template v-slot:opposite>
                    <span class="text-caption">{{ formatDate(activity.createdAt) }}</span>
                  </template>
                  <div>
                    <div class="text-subtitle-2">{{ getActivityTitle(activity) }}</div>
                    <div class="text-caption grey--text">{{ activity.description }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-tab-item>

            <!-- 我的貼文 -->
            <v-tab-item>
              <v-card
                v-for="post in userPosts"
                :key="post.id"
                class="mt-4"
              >
                <v-card-title>{{ post.title }}</v-card-title>
                <v-card-text>
                  <div class="text-caption grey--text mb-2">
                    發布於 {{ formatDate(post.createdAt) }}
                  </div>
                  {{ post.content }}
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="primary">
                    <v-icon left>mdi-thumb-up</v-icon>
                    {{ post.likes }}
                  </v-btn>
                  <v-btn text>
                    <v-icon left>mdi-comment</v-icon>
                    {{ post.comments.length }} 評論
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>

            <!-- 收藏列表 -->
            <v-tab-item>
              <v-row class="mt-4">
                <v-col
                  v-for="favorite in favorites"
                  :key="favorite.id"
                  cols="12"
                  sm="6"
                >
                  <v-card>
                    <v-img
                      v-if="favorite.type === 'movie'"
                      :src="favorite.coverImage"
                      height="200"
                      class="grey lighten-2"
                    ></v-img>
                    <v-card-title>{{ favorite.title }}</v-card-title>
                    <v-card-subtitle>
                      {{ favorite.type === 'movie' ? '電影' : '音樂' }}
                    </v-card-subtitle>
                    <v-card-text>
                      <div class="text-caption grey--text">
                        收藏於 {{ formatDate(favorite.savedAt) }}
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        text
                        color="primary"
                        :to="getFavoriteLink(favorite)"
                      >
                        查看詳情
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click="removeFavorite(favorite.id)"
                      >
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>

    <!-- 編輯個人資料對話框 -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>編輯個人資料</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedUser.username"
              label="用戶名稱"
              :rules="[(v: string) => !!v || '請輸入用戶名稱']"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedUser.email"
              label="電子郵件"
              :rules="[
                (v: string) => !!v || '請輸入電子郵件',
                (v: string) => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件'
              ]"
              required
            ></v-text-field>
            <v-file-input
              v-model="avatarFile"
              label="更換頭像"
              accept="image/*"
              prepend-icon="mdi-camera"
              :show-size="true"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog = false">取消</v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            @click="updateProfile"
          >
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import type { Post } from '@/types/community';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

interface Activity {
  id: number;
  type: 'post' | 'comment' | 'like';
  createdAt: Date;
  description: string;
}

interface UserStats {
  posts: number;
  likes: number;
  comments: number;
}

interface Favorite {
  id: number;
  type: 'movie' | 'music';
  title: string;
  coverImage?: string;
  savedAt: Date;
}

export default defineComponent({
  name: 'UserProfile',

  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const activeTab = ref(0);
    const editDialog = ref(false);
    const valid = ref(false);
    const avatarFile = ref<File | null>(null);

    // 用戶資料
    const user = computed(() => {
      const username = route.params.username as string;
      return username === authStore.currentUser?.username
        ? authStore.currentUser
        : { username, email: '', avatar: '' }; // TODO: 從API獲取其他用戶資料
    });

    const isCurrentUser = computed(() => {
      return user.value.username === authStore.currentUser?.username;
    });

    const editedUser = ref({
      username: user.value.username,
      email: user.value.email,
    });

    // 用戶統計
    const userStats = ref<UserStats>({
      posts: 0,
      likes: 0,
      comments: 0,
    });

    // 最近活動
    const recentActivities = ref<Activity[]>([]);

    // 用戶貼文
    const userPosts = ref<Post[]>([]);

    // 收藏列表
    const favorites = ref<Favorite[]>([]);

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString('zh-TW');
    };

    const getActivityColor = (type: string): string => {
      switch (type) {
        case 'post':
          return 'primary';
        case 'comment':
          return 'green';
        case 'like':
          return 'red';
        default:
          return 'grey';
      }
    };

    const getActivityTitle = (activity: Activity): string => {
      switch (activity.type) {
        case 'post':
          return '發布了新貼文';
        case 'comment':
          return '發表了評論';
        case 'like':
          return '點讚了貼文';
        default:
          return '';
      }
    };

    const getFavoriteLink = (favorite: Favorite): string => {
      return favorite.type === 'movie'
        ? `/movie/${favorite.id}`
        : `/music/${favorite.id}`;
    };

    const updateProfile = async () => {
      try {
        if (avatarFile.value) {
          // TODO: 上傳頭像
        }
        await authStore.updateProfile(editedUser.value);
        editDialog.value = false;
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    };

    const removeFavorite = async (id: number) => {
      try {
        // TODO: 實作移除收藏的 API 調用
        favorites.value = favorites.value.filter(f => f.id !== id);
      } catch (error) {
        console.error('Failed to remove favorite:', error);
      }
    };

    onMounted(async () => {
      try {
        // TODO: 從API獲取用戶統計資料
        // TODO: 從API獲取最近活動
        // TODO: 從API獲取用戶貼文
        // TODO: 從API獲取收藏列表
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    });

    return {
      user,
      isCurrentUser,
      activeTab,
      editDialog,
      valid,
      editedUser,
      avatarFile,
      userStats,
      recentActivities,
      userPosts,
      favorites,
      formatDate,
      getActivityColor,
      getActivityTitle,
      getFavoriteLink,
      updateProfile,
      removeFavorite,
    };
  },
});
</script>

<style scoped>
.user-profile {
  padding: 20px 0;
}
</style>