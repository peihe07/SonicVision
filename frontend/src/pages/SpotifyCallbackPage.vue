<template>
  <div class="spotify-callback">
    <div v-if="loading" class="loading">
      <p>正在處理 Spotify 授權...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retry">重試</button>
    </div>
    <div v-else class="success">
      <p>Spotify 授權成功！</p>
      <button @click="goToHome">返回首頁</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    
    if (success === 'true') {
      // 授權成功，可以進行後續處理
      await authStore.handleSpotifyAuth()
    } else {
      error.value = 'Spotify 授權失敗'
    }
  } catch (e) {
    error.value = '處理 Spotify 授權時發生錯誤'
    console.error(e)
  } finally {
    loading.value = false
  }
})

const retry = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.spotify-callback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.loading, .error, .success {
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error {
  color: #dc3545;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #1db954;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1ed760;
}
</style> 