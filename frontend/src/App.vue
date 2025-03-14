<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="brand">SonicVision</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/discover" class="nav-link">探索</router-link>
        <router-link to="/playlists" class="nav-link">我的歌單</router-link>
        <router-link to="/watchlists" class="nav-link">我的片單</router-link>
        <router-link to="/community" class="nav-link">社群</router-link>
        <router-link to="/about" class="nav-link">關於</router-link>
      </div>
      <div class="nav-auth" v-if="!isAuthenticated">
        <router-link to="/login" class="nav-link">登入</router-link>
        <router-link to="/register" class="btn btn-primary">註冊</router-link>
      </div>
      <div v-else class="nav-user">
        <notification-center class="mr-4"></notification-center>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-avatar size="32">
                <v-img
                  :src="currentUser?.avatar || '/avatars/default.jpg'"
                  alt="用戶頭像"
                ></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="`/user/${currentUser?.username}`">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>個人資料</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>登出</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
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
        <p>&copy; 2024 SonicVision. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import NotificationCenter from '@/components/NotificationCenter.vue';
import { useAuthStore } from '@/store/modules/auth';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  components: {
    NotificationCenter,
  },

  setup() {
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.getCurrentUser);

    const logout = async () => {
      try {
        await authStore.logout();
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    };

    return {
      isAuthenticated,
      currentUser,
      logout,
    };
  },
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

.nav-auth, .nav-user {
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
</style>