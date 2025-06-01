<template>
  <div id="app">
    <Toast />
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="brand">SonicVision</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/discover" class="nav-link">探索</router-link>
        <router-link to="/latest-music" class="nav-link">最新音樂</router-link>
        <router-link to="/watchlists" class="nav-link">最新電影</router-link>
        <router-link to="/community" class="nav-link">社群</router-link>
        <router-link to="/about" class="nav-link">關於</router-link>
      </div>
      <div class="nav-auth" v-if="!isAuthenticated">
        <router-link to="/login" class="nav-link">登入</router-link>
        <router-link to="/register" class="btn btn-primary">註冊</router-link>
      </div>
      <div v-else class="nav-user">
        <div class="user-menu" @click="toggleUserMenu" ref="userMenuRef">
          <img :src="currentUser?.avatar || '/avatars/default.jpg'" :alt="currentUser?.username" class="user-avatar">
          <div class="user-menu-dropdown" v-if="showUserMenu">
            <div class="user-info">
              <strong>{{ currentUser?.username }}</strong>
              <span>{{ currentUser?.email }}</span>
            </div>
            <div class="menu-divider"></div>
            <router-link to="/profile" class="menu-item">
              <i class="fas fa-user"></i>
              個人資料
            </router-link>
            <router-link to="/settings" class="menu-item">
              <i class="fas fa-cog"></i>
              設定
            </router-link>
            <div class="menu-divider"></div>
            <button @click="handleLogout" class="menu-item logout-button">
              <i class="fas fa-sign-out-alt"></i>
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>SonicVision</h3>
          <p>您的音樂與電影探索平台</p>
        </div>
        <div class="footer-section">
          <h3>快速連結</h3>
          <router-link to="/discover" class="footer-link">探索</router-link>
          <router-link to="/playlists" class="footer-link">歌單</router-link>
          <router-link to="/watchlists" class="footer-link">片單</router-link>
        </div>
        <div class="footer-section">
          <h3>聯絡我們</h3>
          <p>contact@sonicvision.com</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 SonicVision. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from '@/components/Toast.vue';

const authStore = useAuthStore();
const router = useRouter();
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    showUserMenu.value = false;
    router.push('/login');
  } catch (error) {
    console.error('登出失敗:', error);
  }
};

// 點擊外部關閉選單
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  authStore.checkAuth();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
#app {
  font-family: 'Microsoft JhengHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand .brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-auth,
.nav-user {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.btn {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
}

.footer-link {
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mr-4 {
  margin-right: 1rem;
}

.nav-user {
  position: relative;
}

.user-menu {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-menu:hover {
  background-color: #34495e;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1000;
}

.user-info {
  padding: 1rem;
  text-align: center;
}

.user-info strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.user-info span {
  display: block;
  color: #666;
  font-size: 0.875rem;
}

.menu-divider {
  height: 1px;
  background-color: #eee;
  margin: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item i {
  width: 1.25rem;
  text-align: center;
}

.logout-button {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #e74c3c;
}

.logout-button:hover {
  background-color: #fee2e2;
}
</style>