<template>
  <div class="tmdb-lists-page">
    <h1>TMDB 推薦片單</h1>
    
    <div class="lists-grid" v-if="lists.length">
      <div v-for="movie in lists" :key="movie.id" class="list-card">
        <router-link :to="'/movie/' + movie.id">
          <div class="list-cover">
            <img :src="movie.poster_path" :alt="movie.title">
          </div>
          <div class="list-info">
            <h3>{{ movie.title }}</h3>
            <p class="description">{{ movie.overview }}</p>
            <div class="meta-info">
              <span class="rating">
                <i class="fas fa-star"></i>
                {{ movie.vote_average.toFixed(1) }}
              </span>
              <span class="vote-count">({{ movie.vote_count }}票)</span>
              <span class="release-date">{{ movie.release_date?.split('-')[0] }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div v-else-if="!loading && !error" class="no-results">
      <p>目前沒有可用的片單</p>
    </div>

    <div class="loading" v-if="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <div class="error" v-if="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchLists" class="retry-button">重試</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

interface TmdbApiList {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
}

interface TmdbApiResponse {
  results: TmdbApiList[]
  total_results: number
}

interface TmdbList {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
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

const lists = ref<TmdbList[]>([])
const loading = ref(false)
const error = ref('')
const defaultCoverUrl = '/images/no-poster.png'

const fetchLists = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await axios.get<TmdbApiResponse>('/tmdb/featured-lists/')
    
    if (!response.data?.results) {
      throw new Error('無效的 API 響應格式')
    }
    
    lists.value = response.data.results.map((item: TmdbApiList) => ({
      id: item.id,
      title: item.title || '未命名電影',
      overview: item.overview || '無描述',
      poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : defaultCoverUrl,
      backdrop_path: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
      vote_average: item.vote_average,
      vote_count: item.vote_count,
      release_date: item.release_date
    }))
  } catch (err: unknown) {
    const apiError = err as ApiError
    console.error('載入 TMDB 片單失敗:', apiError)
    error.value = apiError.response?.status === 404 
      ? 'API 端點不存在，請確認後端服務是否正確配置'
      : `載入片單時發生錯誤: ${apiError.message || '未知錯誤'}`
  } finally {
    loading.value = false
  }
}

onMounted(fetchLists)
</script>

<style scoped>
.tmdb-lists-page {
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.list-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.list-card:hover {
  transform: translateY(-4px);
}

.list-card a {
  text-decoration: none;
  color: inherit;
}

.list-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
}

.list-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-info {
  padding: 1.5rem;
}

.list-info h3 {
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

.meta-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.rating {
  margin-right: 0.5rem;
}

.vote-count {
  margin-right: 0.5rem;
}

.release-date {
  margin-left: 0.5rem;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #2980b9;
}

.no-results {
  color: #666;
  font-size: 1.1rem;
}
</style> 