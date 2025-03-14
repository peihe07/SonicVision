<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-avatar-section">
        <div class="avatar-container" @click="triggerFileInput">
          <img 
            :src="currentUser?.avatar || '/avatars/default.jpg'" 
            :alt="currentUser?.username"
            class="profile-avatar"
          >
          <div class="avatar-overlay">
            <i class="fas fa-camera"></i>
            <span>更換頭像</span>
          </div>
        </div>
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleAvatarChange" 
          accept="image/*" 
          style="display: none"
        >
      </div>
      <div class="profile-info">
        <h1>{{ currentUser?.username }}</h1>
        <p>{{ currentUser?.email }}</p>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h2>基本資料</h2>
        <form @submit.prevent="handleSubmit" class="profile-form">
          <div class="form-group">
            <label>用戶名稱</label>
            <input 
              v-model="profileForm.username" 
              type="text" 
              class="form-control"
              placeholder="請輸入用戶名稱"
            >
          </div>
          <div class="form-group">
            <label>電子郵件</label>
            <input 
              v-model="profileForm.email" 
              type="email" 
              class="form-control"
              placeholder="請輸入電子郵件"
            >
          </div>
          <div class="form-group">
            <label>個人簡介</label>
            <textarea 
              v-model="profileForm.bio" 
              class="form-control"
              rows="4"
              placeholder="介紹一下自己..."
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '儲存中...' : '儲存變更' }}
          </button>
        </form>
      </div>

      <div class="profile-section">
        <h2>活動統計</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <i class="fas fa-music"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.playlistCount }}</span>
              <span class="stat-label">音樂歌單</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-film"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.watchlistCount }}</span>
              <span class="stat-label">電影片單</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-comments"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.postCount }}</span>
              <span class="stat-label">社群貼文</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-heart"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.likeCount }}</span>
              <span class="stat-label">獲得讚數</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import type { ProfileUpdateData } from '@/types/api';
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ProfilePage',

  setup() {
    const authStore = useAuthStore();
    const fileInput = ref<HTMLInputElement | null>(null);
    const loading = ref(false);

    const currentUser = computed(() => authStore.currentUser);

    const profileForm = ref({
      username: currentUser.value?.username || '',
      email: currentUser.value?.email || '',
      bio: currentUser.value?.bio || '',
      avatar: null as File | null
    });

    const stats = ref({
      playlistCount: 0,
      watchlistCount: 0,
      postCount: 0,
      likeCount: 0
    });

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleAvatarChange = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        try {
          loading.value = true;
          profileForm.value.avatar = file;
        } catch (error) {
          console.error('上傳頭像失敗:', error);
        } finally {
          loading.value = false;
        }
      }
    };

    const handleSubmit = async () => {
      try {
        const updateData: ProfileUpdateData = {
          username: profileForm.value.username,
          email: profileForm.value.email,
          bio: profileForm.value.bio
        };
        
        if (profileForm.value.avatar) {
          updateData.avatar = profileForm.value.avatar;
        }
        
        await authStore.updateProfile(updateData);
      } catch (error) {
        console.error('更新個人資料失敗:', error);
      }
    };

    const fetchUserStats = async () => {
      // TODO: 實現獲取用戶統計數據的 API
      stats.value = {
        playlistCount: 5,
        watchlistCount: 3,
        postCount: 12,
        likeCount: 48
      };
    };

    onMounted(() => {
      fetchUserStats();
    });

    return {
      currentUser,
      fileInput,
      loading,
      profileForm,
      stats,
      triggerFileInput,
      handleAvatarChange,
      handleSubmit
    };
  }
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.profile-avatar-section {
  position: relative;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.profile-info h1 {
  margin: 0;
  color: #2c3e50;
}

.profile-info p {
  color: #666;
  margin: 0.5rem 0 0;
}

.profile-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-section h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #42b983;
  outline: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item i {
  font-size: 2rem;
  color: #42b983;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover {
  background: #3aa876;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 