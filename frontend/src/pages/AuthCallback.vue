<template>
  <div class="auth-callback">
    <div v-if="loading" class="loading">
      處理登入中...
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthAPI } from '../api/auth';

export default defineComponent({
  name: 'AuthCallback',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authAPI = useAuthAPI();
    const loading = ref(true);
    const error = ref<string | null>(null);

    onMounted(async () => {
      try {
        const code = route.query.code as string;
        if (!code) {
          throw new Error('未收到授權碼');
        }

        await authAPI.googleLogin(code);
        router.push('/discover');
      } catch (err) {
        console.error('處理 OAuth 回調時發生錯誤:', err);
        error.value = '登入失敗，請稍後再試';
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      error
    };
  }
});
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.loading {
  font-size: 1.2rem;
  color: #2c3e50;
}

.error {
  color: #e74c3c;
  font-size: 1.2rem;
}
</style> 