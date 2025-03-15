<template>
    <div class="movie-detail" v-if="movie">
        <div class="movie-header" :style="{ backgroundImage: getBackgroundImage(movie) }">
            <div class="overlay">
                <div class="content">
                    <img :src="movie.poster_path" :alt="movie.title" class="poster">
                    <div class="info">
                        <h1>{{ movie.title }}</h1>
                        <h2 v-if="movie.original_title !== movie.title" class="original-title">
                            {{ movie.original_title }}
                        </h2>
                        <div class="meta">
                            <span class="release-date">{{ formatDate(movie.release_date) }}</span>
                            <span class="runtime" v-if="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
                            <span class="rating">
                                <i class="fas fa-star"></i>
                                {{ movie.vote_average }}
                                <span class="vote-count">({{ movie.vote_count }}票)</span>
                            </span>
                        </div>
                        <div class="genres">
                            <span v-for="genre in movie.genres" :key="genre" class="genre-tag">
                                {{ genre }}
                            </span>
                        </div>
                        <p class="tagline" v-if="movie.tagline">{{ movie.tagline }}</p>
                        <p class="overview">{{ movie.overview }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="movie-content">
            <!-- 預告片區域 -->
            <section class="videos-section" v-if="movie.videos?.length">
                <h2>預告片</h2>
                <div class="videos-grid">
                    <div v-for="video in movie.videos" :key="video.id" class="video-card">
                        <a :href="getVideoUrl(video)" target="_blank" rel="noopener noreferrer">
                            <img :src="getYouTubeThumbnail(video.key)" :alt="video.type">
                            <div class="play-icon">▶</div>
                        </a>
                    </div>
                </div>
            </section>

            <!-- 演員區域 -->
            <section class="cast-section" v-if="movie.cast?.length">
                <h2>主要演員</h2>
                <div class="cast-grid">
                    <div v-for="actor in movie.cast" :key="actor.id" class="cast-card">
                        <a :href="`https://www.themoviedb.org/person/${actor.id}`" target="_blank" rel="noopener noreferrer">
                            <img 
                                :src="actor.profile_path || '/images/no-profile.png'"
                                :alt="actor.name"
                                class="actor-photo"
                            >
                            <div class="actor-info">
                                <h3>{{ actor.name }}</h3>
                                <p>{{ actor.character }}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <!-- 製作資訊 -->
            <section class="production-info">
                <h2>製作資訊</h2>
                <div class="production-grid">
                    <div class="info-item" v-if="movie.budget">
                        <h3>預算</h3>
                        <p>{{ formatCurrency(movie.budget) }}</p>
                    </div>
                    <div class="info-item" v-if="movie.revenue">
                        <h3>票房</h3>
                        <p>{{ formatCurrency(movie.revenue) }}</p>
                    </div>
                    <div class="info-item" v-if="movie.production_countries?.length">
                        <h3>製作國家</h3>
                        <p>{{ movie.production_countries.join(', ') }}</p>
                    </div>
                    <div class="info-item" v-if="movie.spoken_languages?.length">
                        <h3>語言</h3>
                        <p>{{ movie.spoken_languages.join(', ') }}</p>
                    </div>
                </div>
            </section>

            <!-- 相似電影 -->
            <section class="similar-movies" v-if="movie.similar_movies?.length">
                <h2>相似電影</h2>
                <div class="similar-movies-grid">
                    <div v-for="similar in movie.similar_movies" :key="similar.id" class="similar-movie-card">
                        <div class="movie-link" @click="navigateToMovie(similar.id)">
                            <img :src="similar.poster_path" :alt="similar.title">
                            <div class="similar-movie-info">
                                <h3>{{ similar.title }}</h3>
                                <span class="rating">
                                    <i class="fas fa-star"></i>
                                    {{ similar.vote_average.toFixed(1) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <div v-else-if="loading" class="loading">
        <div class="spinner"></div>
        <p>載入中...</p>
    </div>
    <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchMovieData">重試</button>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Movie {
    id: number;
    title: string;
    original_title?: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
    release_year?: string;
    runtime?: number;
    genres: string[];
    production_countries: string[];
    spoken_languages: string[];
    budget?: number;
    revenue?: number;
    cast: Array<{
        id: number;
        name: string;
        character: string;
        profile_path: string;
    }>;
    videos: Array<{
        id: string;
        key: string;
        site: string;
        type: string;
    }>;
    similar_movies: Array<{
        id: number;
        title: string;
        poster_path: string;
        vote_average: number;
    }>;
    status?: string;
    tagline?: string;
    popularity?: number;
}

export default defineComponent({
    name: 'MovieDetailPage',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const movie = ref<Movie | null>(null);
        const loading = ref(true);
        const error = ref<string | null>(null);

        const director = computed(() => {
            if (!movie.value?.cast) return null;
            return movie.value.cast[0];
        });

        const fetchMovieData = async () => {
            const movieId = route.params.id;
            if (!movieId) {
                error.value = '無效的電影 ID';
                return;
            }

            try {
                loading.value = true;
                error.value = null;
                const response = await axios.get(`/tmdb/movies/${movieId}/`);
                if (!response.data) {
                    throw new Error('無效的響應數據');
                }
                movie.value = response.data;
            } catch (err) {
                console.error('獲取電影詳情失敗:', err);
                error.value = '無法載入電影詳情，請稍後再試';
            } finally {
                loading.value = false;
            }
        };

        const formatDate = (dateString: string) => {
            if (!dateString) return '暫無日期';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatRuntime = (minutes: number) => {
            if (!minutes) return '片長未知';
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}小時 ${remainingMinutes}分鐘`;
        };

        const formatCurrency = (amount: number) => {
            if (!amount) return '未知';
            return new Intl.NumberFormat('zh-TW', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(amount);
        };

        const getImageUrl = (path: string | null): string => {
            if (!path) return '/images/no-poster.png';
            return path;
        };

        const getBackgroundImage = (movie: Movie): string => {
            const imageUrl = movie.backdrop_path || movie.poster_path || '';
            return `url(${imageUrl})`;
        };

        const getYouTubeThumbnail = (videoKey: string): string => {
            return `https://img.youtube.com/vi/${videoKey}/mqdefault.jpg`;
        };

        const getVideoUrl = (video: { key: string; type: string }): string => {
            return `https://www.youtube.com/watch?v=${video.key}`;
        };

        const navigateToMovie = async (movieId: number) => {
            await router.push(`/movie/${movieId}`);
            await fetchMovieData();
        };

        // 監聽路由參數變化
        watch(
            () => route.params.id,
            async (newId) => {
                if (newId) {
                    await fetchMovieData();
                }
            }
        );

        onMounted(fetchMovieData);

        return {
            movie,
            loading,
            error,
            director,
            getImageUrl,
            getBackgroundImage,
            getYouTubeThumbnail,
            formatDate,
            formatRuntime,
            formatCurrency,
            getVideoUrl,
            fetchMovieData,
            navigateToMovie
        };
    }
});
</script>

<style scoped>
.movie-detail {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.movie-header {
    position: relative;
    height: 70vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
    padding: 2rem;
    display: flex;
    align-items: center;
}

.content {
    display: flex;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    color: white;
}

.poster {
    width: 300px;
    height: 450px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.info {
    flex: 1;
}

.info h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.rating {
    color: #f1c40f;
}

.genres {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.genre-tag {
    background-color: rgba(255,255,255,0.2);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.overview {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 800px;
}

.movie-content {
    max-width: 1200px;
    margin: -4rem auto 0;
    padding: 2rem;
    position: relative;
    z-index: 1;
}

.videos-section {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.video-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}

.video-card img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
}

.play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    color: white;
    background: rgba(0,0,0,0.5);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cast-section {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.cast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.cast-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cast-card a {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform 0.2s ease;
}

.cast-card a:hover {
    transform: translateY(-4px);
}

.actor-photo {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
}

.actor-info {
    padding: 0.5rem;
}

.actor-info h3 {
    font-size: 1rem;
    margin-bottom: 0.3rem;
}

.actor-info p {
    font-size: 0.9rem;
    color: #666;
}

.production-info {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.production-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.info-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-item h3 {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.info-item p {
    color: #666;
}

.similar-movies {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.similar-movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.similar-movie-card {
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.similar-movie-card:hover {
    transform: scale(1.05);
}

.similar-movie-card img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
}

.similar-movie-info {
    padding: 0.5rem;
    background: rgba(0,0,0,0.8);
}

.similar-movie-info h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: white;
}

.original-title {
    font-size: 1.2rem;
    color: #ccc;
    margin-bottom: 1rem;
}

.tagline {
    font-style: italic;
    color: #ddd;
    margin-bottom: 1rem;
}

.vote-count {
    font-size: 0.9rem;
    color: #ccc;
    margin-left: 0.5rem;
}

.loading, .error {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.error button:hover {
    background: #2980b9;
}

@media (max-width: 768px) {
    .content {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .poster {
        width: 200px;
        height: 300px;
        margin-bottom: 1rem;
    }

    .genres {
        justify-content: center;
    }

    .movie-header {
        height: auto;
        min-height: 100vh;
    }

    .movie-content {
        margin-top: 0;
    }
}

.movie-link {
    cursor: pointer;
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
}

.similar-movie-card .movie-link {
    transition: transform 0.2s;
}

.similar-movie-card:hover .movie-link {
    transform: scale(1.05);
}
</style> 