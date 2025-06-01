<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { spotifyAPI } from '@/api/spotify'
import { tmdbAPI } from '@/api/tmdb'
import type { SpotifyTrack } from '@/api/spotify'
import type { Movie } from '@/api/tmdb'

const trendingMusic = ref<SpotifyTrack[]>([])
const trendingMovies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchTrendingContent = async () => {
    try {
        console.log('開始獲取熱門內容...')
        loading.value = true
        error.value = null

        // 並行獲取音樂和電影數據
        const [musicData, movieData] = await Promise.all([
            spotifyAPI.getTrendingMusic(),
            tmdbAPI.getTrendingMovies()
        ])

        console.log('獲取到的音樂數據:', musicData)
        console.log('獲取到的電影數據:', movieData)

        trendingMusic.value = musicData
        trendingMovies.value = movieData
    } catch (err) {
        console.error('獲取熱門內容時發生錯誤:', err)
        error.value = '獲取熱門內容失敗，請稍後再試'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchTrendingContent()
})
</script>

<template>
    <div class="home-page">
        <h1>熱門內容</h1>

        <div v-if="loading" class="loading">
            載入中...
        </div>

        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <div v-else>
            <!-- 熱門音樂 -->
            <section class="trending-section">
                <h2>熱門音樂</h2>
                <div class="music-grid">
                    <div v-for="track in trendingMusic" :key="track.id" class="music-card">
                        <img :src="track.album.images[0]?.url" :alt="track.name" class="album-cover">
                        <div class="track-info">
                            <h3>{{ track.name }}</h3>
                            <p>{{track.artists.map(artist => artist.name).join(', ')}}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 熱門電影 -->
            <section class="trending-section">
                <h2>熱門電影</h2>
                <div class="movie-grid">
                    <div v-for="movie in trendingMovies" :key="movie.id" class="movie-card">
                        <img :src="movie.poster_path" :alt="movie.title" class="movie-poster">
                        <div class="movie-info">
                            <h3>{{ movie.title }}</h3>
                            <p>{{ movie.release_date }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.home-page {
    padding: 2rem;
}

.trending-section {
    margin-bottom: 3rem;
}

.music-grid,
.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.music-card,
.movie-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.music-card:hover,
.movie-card:hover {
    transform: translateY(-4px);
}

.album-cover,
.movie-poster {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
}

.track-info,
.movie-info {
    padding: 1rem;
}

h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
}

p {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #666;
}

.loading,
.error {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.error {
    color: #dc3545;
}
</style>