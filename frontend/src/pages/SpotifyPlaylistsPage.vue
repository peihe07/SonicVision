<template>
  <div class="spotify-playlists-page">
    <h1>Spotify 推薦歌單</h1>
    
    <div class="playlists-grid" v-if="playlists.length">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card">
        <a :href="'https://open.spotify.com/playlist/' + playlist.id" target="_blank" rel="noopener noreferrer">
          <div class="playlist-cover">
            <img :src="playlist.coverUrl || defaultCoverUrl" :alt="playlist.name">
          </div>
          <div class="playlist-info">
            <h3>{{ playlist.name }}</h3>
            <p class="description">{{ playlist.description }}</p>
            <p class="track-count">{{ playlist.trackCount }} 首歌曲</p>
            <p class="owner">由 {{ playlist.owner }} 創建</p>
          </div>
        </a>
      </div>
    </div>

    <div class="loading" v-if="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <div class="error" v-if="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  coverUrl: string
  owner: string
  trackCount: number
}

interface SpotifyApiPlaylist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  owner: {
    display_name: string
  }
  tracks: {
    total: number
  }
}

interface SpotifyApiResponse {
  playlists: {
    items: SpotifyApiPlaylist[]
  }
}

interface ApiError {
  response?: {
    status: number
    data?: {
      message?: string
    }
  }
  message: string
}

const playlists = ref<SpotifyPlaylist[]>([])
const loading = ref(false)
const error = ref('')
const defaultCoverUrl = '/images/no-poster.png'

onMounted(async () => {
  try {
    loading.value = true
    const response = await axios.get<SpotifyApiResponse>('/spotify/featured-playlists/')
    
    if (!response.data?.playlists?.items) {
      throw new Error('無效的 API 響應格式')
    }
    
    playlists.value = response.data.playlists.items.map((item: SpotifyApiPlaylist) => ({
      id: item.id,
      name: item.name,
      description: item.description || '無描述',
      coverUrl: item.images?.[0]?.url || defaultCoverUrl,
      owner: item.owner?.display_name || '未知創建者',
      trackCount: item.tracks?.total || 0
    }))
  } catch (err: unknown) {
    const apiError = err as ApiError
    console.error('載入 Spotify 歌單失敗:', apiError)
    error.value = apiError.response?.status === 404 
      ? 'API 端點不存在，請確認後端服務是否正確配置'
      : `載入歌單時發生錯誤: ${apiError.message || '未知錯誤'}`
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.spotify-playlists-page {
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.playlist-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.playlist-card:hover {
  transform: translateY(-4px);
}

.playlist-card a {
  text-decoration: none;
  color: inherit;
}

.playlist-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-info {
  padding: 1.5rem;
}

.playlist-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.description {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.track-count {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #3498db;
}

.owner {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: #666;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading i, .error i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error {
  color: #e74c3c;
}
</style> 