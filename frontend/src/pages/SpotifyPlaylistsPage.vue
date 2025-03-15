<template>
  <div class="spotify-playlists-page">
    <h1>全球最新發行</h1>
    
    <div class="albums-grid" v-if="albums.length">
      <div v-for="album in albums" :key="album.id" class="album-card">
        <a :href="album.external_urls.spotify" target="_blank" rel="noopener noreferrer">
          <div class="album-cover">
            <img :src="album.images[0]?.url || defaultCoverUrl" :alt="album.name">
          </div>
          <div class="album-info">
            <h3>{{ album.name }}</h3>
            <p class="artists">
              {{ album.artists.map(artist => artist.name).join(', ') }}
            </p>
            <p class="release-date">發行日期: {{ formatDate(album.release_date) }}</p>
            <p class="track-count">{{ album.total_tracks }} 首歌曲</p>
            <div class="tracks-preview" v-if="album.tracks.length">
              <h4>歌曲列表：</h4>
              <ul>
                <li v-for="track in album.tracks.slice(0, 3)" :key="track.id">
                  {{ track.name }}
                  <span v-if="track.preview_url" class="preview-button" @click.prevent="playPreview(track)">
                    <i class="fas" :class="currentPreviewTrack?.id === track.id ? 'fa-pause' : 'fa-play'"></i>
                  </span>
                </li>
              </ul>
            </div>
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

    <audio ref="audioPlayer" @ended="stopPreview"></audio>
  </div>
</template>

<script setup lang="ts">
import { apiClient } from '@/services/api'
import { onMounted, ref } from 'vue'

interface SpotifyArtist {
  id: string
  name: string
  external_urls: {
    spotify: string
  }
}

interface SpotifyTrack {
  id: string
  name: string
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  duration_ms: number
  track_number: number
  artists: SpotifyArtist[]
}

interface SpotifyAlbum {
  id: string
  name: string
  type: string
  artists: SpotifyArtist[]
  images: Array<{ url: string }>
  release_date: string
  total_tracks: number
  external_urls: {
    spotify: string
  }
  tracks: SpotifyTrack[]
  popularity: number
}

interface SpotifyApiResponse {
  albums: {
    items: SpotifyAlbum[]
    total: number
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
  code?: string
}

const albums = ref<SpotifyAlbum[]>([])
const loading = ref(false)
const error = ref('')
const defaultCoverUrl = '/images/no-poster.png'
const audioPlayer = ref<HTMLAudioElement | null>(null)
const currentPreviewTrack = ref<SpotifyTrack | null>(null)

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

const playPreview = (track: SpotifyTrack) => {
  if (!audioPlayer.value) return
  
  if (currentPreviewTrack.value?.id === track.id && !audioPlayer.value.paused) {
    audioPlayer.value.pause()
    currentPreviewTrack.value = null
  } else {
    if (track.preview_url) {
      audioPlayer.value.src = track.preview_url
      audioPlayer.value.play()
      currentPreviewTrack.value = track
    }
  }
}

const stopPreview = () => {
  currentPreviewTrack.value = null
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await apiClient.get<SpotifyApiResponse>('/spotify/featured-playlists/')
    
    if (!response.data?.albums?.items) {
      throw new Error('無效的 API 響應格式')
    }
    
    albums.value = response.data.albums.items
  } catch (err: unknown) {
    const apiError = err as ApiError
    console.error('載入 Spotify 最新發行失敗:', apiError)
    if (apiError.code === 'ERR_NETWORK') {
      error.value = '無法連接到服務器，請確認後端服務是否正在運行'
    } else if (apiError.response?.status === 404) {
      error.value = 'API 端點不存在，請確認後端服務是否正確配置'
    } else if (apiError.response?.status === 401) {
      error.value = 'Spotify 授權已過期，請重新登入'
    } else if (apiError.response?.status === 503) {
      error.value = '無法初始化 Spotify 客戶端，請確認 API 憑證是否正確'
    } else {
      error.value = `載入最新發行時發生錯誤: ${apiError.message || '未知錯誤'}`
    }
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

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.album-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.album-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.album-card a {
  text-decoration: none;
  color: inherit;
}

.album-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.album-card:hover .album-cover img {
  transform: scale(1.05);
}

.album-info {
  padding: 1.5rem;
}

.album-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
}

.artists {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #3498db;
  font-weight: 500;
}

.release-date {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.track-count {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.tracks-preview {
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.tracks-preview h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #2c3e50;
}

.tracks-preview ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tracks-preview li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-button {
  cursor: pointer;
  color: #3498db;
  padding: 0.3rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.preview-button:hover {
  background-color: rgba(52, 152, 219, 0.1);
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