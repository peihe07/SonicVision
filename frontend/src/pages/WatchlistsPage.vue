<template>
    <div class="watchlists-page">
        <h1 class="page-title">最新電影</h1>

        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>載入中...</p>
        </div>

        <div v-else-if="error" class="error">
            <p>{{ error }}</p>
            <button @click="fetchMovies" class="retry-button">重試</button>
        </div>

        <div v-else class="movies-grid">
            <div v-for="movie in movies" :key="movie.id" class="movie-card">
                <router-link :to="'/movie/' + movie.id" class="movie-link">
                    <div class="movie-poster">
                        <img :src="movie.poster_path || '/images/no-poster.jpg'" :alt="movie.title"
                            @error="handleImageError">
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">{{ movie.title }}</h3>
                        <p class="movie-release-date">
                            上映日期: {{ formatDate(movie.tw_release_date || movie.release_date) }}
                        </p>
                        <div class="movie-rating">
                            <span class="rating-value">{{ movie.vote_average.toFixed(1) }}</span>
                            <span class="rating-count">({{ movie.vote_count }} 評分)</span>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const movies = ref([])
const loading = ref(true)
const error = ref('')

const fetchMovies = async () => {
    loading.value = true
    error.value = ''

    try {
        const response = await axios.get('/api/tmdb/featured-lists/')
        movies.value = response.data.results
    } catch (err) {
        console.error('獲取電影列表失敗:', err)
        error.value = '無法載入電影列表，請稍後再試'
        showToast('無法載入電影列表', 'error')
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return '未定'
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/images/no-poster.jpg'
}

onMounted(() => {
    fetchMovies()
})
</script>

<style scoped>
.watchlists-page {
    padding: 2rem;
}

.page-title {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #42b983;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error {
    text-align: center;
    color: #e74c3c;
    margin: 2rem 0;
}

.retry-button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
}

.retry-button:hover {
    background-color: #3aa876;
}

.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
    padding: 1rem;
}

.movie-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.movie-card:hover {
    transform: translateY(-5px);
}

.movie-link {
    text-decoration: none;
    color: inherit;
}

.movie-poster {
    position: relative;
    padding-top: 150%;
    overflow: hidden;
}

.movie-poster img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.movie-info {
    padding: 1rem;
}

.movie-title {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.movie-release-date {
    font-size: 0.875rem;
    color: #666;
    margin: 0 0 0.5rem 0;
}

.movie-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.rating-value {
    font-weight: bold;
    color: #42b983;
}

.rating-count {
    font-size: 0.875rem;
    color: #666;
}

@media (max-width: 768px) {
    .watchlists-page {
        padding: 1rem;
    }

    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    .movie-info {
        padding: 0.75rem;
    }

    .movie-title {
        font-size: 0.875rem;
    }
}
</style>