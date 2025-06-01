<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>登入</h1>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="username">用戶名稱</label>
          <input type="text" id="username" v-model="form.username" required class="form-control"
            placeholder="請輸入您的用戶名稱">
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="form.password" required class="form-control"
            placeholder="請輸入您的密碼">
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember">
            <span>記住我</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            忘記密碼？
          </router-link>
        </div>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="loading">登入中...</span>
          <span v-else>登入</span>
        </button>
      </form>
      <div class="auth-divider">
        <span>或</span>
      </div>
      <div class="social-login">
        <button class="btn btn-outline btn-block" @click="handleGoogleLogin">
          <i class="fab fa-google"></i> 使用 Google 帳號登入
        </button>
      </div>
      <div class="auth-footer">
        還沒有帳號？
        <router-link to="/register">立即註冊</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

interface GoogleResponse {
  code: string;
}

interface GoogleCodeClient {
  requestCode(): void;
}

interface GoogleOAuth2 {
  initCodeClient(config: {
    client_id: string;
    scope: string;
    ux_mode: string;
    redirect_uri: string;
    state: string;
    callback: (response: GoogleResponse) => void;
  }): GoogleCodeClient;
}

interface GoogleAccounts {
  oauth2: GoogleOAuth2;
}

interface Google {
  accounts: GoogleAccounts;
}

interface FormData {
  username: string;
  password: string;
  remember: boolean;
}

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const route = useRoute();

    const form = ref<FormData>({
      username: '',
      password: '',
      remember: false
    });

    const error = ref<string | null>(null);
    const loading = ref(false);

    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = null;
        await authStore.login({
          username: form.value.username,
          password: form.value.password
        });
        const redirectPath = route.query.redirect as string;
        router.push(redirectPath || '/discover');
      } catch (err) {
        console.error('Login error:', err);
        error.value = authStore.error || '登入失敗，請檢查您的用戶名稱和密碼';
      } finally {
        loading.value = false;
      }
    };

    const handleGoogleLogin = async () => {
      try {
        loading.value = true;
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.error('Google Client ID 未配置');
          error.value = '系統配置錯誤，請聯繫管理員';
          return;
        }

        const googleApi = (window as unknown as { google: Google }).google;
        const client = googleApi.accounts.oauth2.initCodeClient({
          client_id: clientId,
          scope: 'email profile openid',
          ux_mode: 'redirect',
          redirect_uri: `${window.location.origin}/auth/callback`,
          state: 'login',
          callback: async (response: GoogleResponse) => {
            if (response.code) {
              try {
                await authStore.googleLogin(response.code);
                const redirectPath = route.query.redirect as string;
                router.push(redirectPath || '/discover');
              } catch (err) {
                console.error('Google 登入處理失敗:', err);
                error.value = '使用 Google 登入失敗，請稍後再試';
              } finally {
                loading.value = false;
              }
            }
          },
        });

        client.requestCode();
      } catch (err) {
        console.error('Google Sign-In 初始化失敗:', err);
        error.value = '無法連接到 Google 服務，請確保瀏覽器未阻擋彈出視窗';
        loading.value = false;
      }
    };

    return {
      form,
      error,
      loading,
      handleLogin,
      handleGoogleLogin
    };
  }
});
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  margin: -2rem;
  padding: 2rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
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
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-outline {
  background-color: white;
  border: 2px solid #3498db;
  color: #3498db;
}

.btn-outline:hover {
  background-color: #3498db;
  color: white;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #95a5a6;
  color: white;
  border: none;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
}

.auth-divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #ddd;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background: white;
  padding: 0 1rem;
  color: #666;
}

.social-login {
  margin-bottom: 1.5rem;
}

.social-login .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-footer {
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  margin-left: 0.5rem;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>