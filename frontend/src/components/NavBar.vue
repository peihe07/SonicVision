<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">
        <img src="@/assets/logo.png" alt="SonicVision" class="brand-logo">
        <span class="brand-name">SonicVision</span>
      </router-link>
    </div>

    <div class="nav-links">
      <router-link to="/" class="nav-link" active-class="active" exact>
        <i class="fas fa-home"></i> 首頁
      </router-link>
      <router-link to="/discover" class="nav-link" active-class="active">
        <i class="fas fa-compass"></i> 發現
      </router-link>
      <router-link to="/spotify-playlists" class="nav-link" active-class="active">
        <i class="fab fa-spotify"></i> 音樂推薦
      </router-link>
      <router-link to="/tmdb-lists" class="nav-link" active-class="active">
        <i class="fas fa-film"></i> 電影推薦
      </router-link>
      <router-link to="/community" class="nav-link" active-class="active">
        <i class="fas fa-users"></i> 社群
      </router-link>
      <router-link to="/about" class="nav-link" active-class="active">
        <i class="fas fa-info-circle"></i> 關於
      </router-link>
    </div>

    <div class="nav-auth">
      <template v-if="isAuthenticated">
        <button class="btn btn-link" @click="logout">
          <i class="fas fa-sign-out-alt"></i> 登出
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="btn btn-link">
          <i class="fas fa-sign-in-alt"></i> 登入
        </router-link>
        <router-link to="/register" class="btn btn-primary">
          <i class="fas fa-user-plus"></i> 註冊
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  height: 64px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-brand {
  margin-right: 2rem;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  height: 32px;
  margin-right: 0.5rem;
}

.brand-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.nav-links {
  flex: 1;
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  color: #3498db;
  background: #f8f9fa;
}

.nav-link.active {
  color: #3498db;
  background: #e3f2fd;
}

.nav-link i {
  font-size: 1.1rem;
}

.nav-auth {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-link {
  background: none;
  border: none;
  color: #666;
  text-decoration: none;
}

.btn-link:hover {
  color: #3498db;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  text-decoration: none;
}

.btn-primary:hover {
  background: #2980b9;
}
</style> 