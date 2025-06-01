<template>
  <div class="google-login-button">
    <button class="btn-google" @click="handleGoogleLogin">
      <img src="@/assets/google-icon.svg" alt="Google" class="google-icon">
      使用 Google 帳號登入
    </button>
  </div>
</template>

<script lang="ts">
import { authAPI } from '@/services/api';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'GoogleLoginButton',
  setup() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
      try {
        // 載入 Google Identity Services
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // 初始化 Google Sign-In
        const client = google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'email profile',
          callback: async (response: any) => {
            if (response.access_token) {
              try {
                const result = await authAPI.googleLogin(response.access_token);
                // 登入成功，導向首頁
                router.push('/');
              } catch (error) {
                console.error('Google 登入失敗:', error);
                alert('Google 登入失敗，請稍後再試');
              }
            }
          },
        });

        // 請求 access token
        client.requestAccessToken();
      } catch (error) {
        console.error('Google Sign-In 初始化失敗:', error);
        alert('無法連接到 Google 服務，請稍後再試');
      }
    };

    return {
      handleGoogleLogin
    };
  }
});
</script>

<style scoped>
.google-login-button {
  margin: 1rem 0;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #444;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-google:hover {
  background-color: #f5f5f5;
}

.google-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
</style>