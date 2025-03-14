<template>
    <div class="movie-detail" v-if="movie">
        <div class="movie-header" :style="{ backgroundImage: `url(${getImageUrl(movie.poster_path)})` }">
            <div class="overlay">
                <div class="content">
                    <img :src="getImageUrl(movie.poster_path, 'w500')" :alt="movie.title" class="poster">
                    <div class="info">
                        <h1>{{ movie.title }}</h1>
                        <div class="meta">
                            <span class="release-date">{{ formatDate(movie.release_date) }}</span>
                            <span class="runtime">{{ formatRuntime(movie.runtime) }}</span>
                            <span class="rating">
                                <i class="fas fa-star"></i>
                                {{ movie.vote_average.toFixed(1) }}
                            </span>
                        </div>
                        <div class="genres">
                            <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
                                {{ genre.name }}
                            </span>
                        </div>
                        <p class="overview">{{ movie.overview }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="movie-content">
            <section class="cast-section" v-if="movie.credits?.cast?.length">
                <h2>主要演員</h2>
                <div class="cast-grid">
                    <div v-for="actor in movie.credits.cast.slice(0, 6)" :key="actor.id" class="cast-card">
                        <a :href="getTMDBPersonUrl(actor.id)" target="_blank" rel="noopener noreferrer" class="actor-link">
                            <img 
                                :src="actor.profile_path ? getImageUrl(actor.profile_path, 'w185') : '/images/no-profile.png'"
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

            <section class="crew-section">
                <h2>製作團隊</h2>
                <div class="crew-info">
                    <div class="crew-member" v-if="director">
                        <h3>導演</h3>
                        <p>{{ director.name }}</p>
                    </div>
                    <div class="crew-member" v-for="role in importantCrew" :key="role.id">
                        <h3>{{ role.job }}</h3>
                        <p>{{ role.name }}</p>
                    </div>
                </div>
            </section>

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
                    <div class="info-item" v-if="movie.production_companies?.length">
                        <h3>製作公司</h3>
                        <p>{{ movie.production_companies.map(company => company.name).join(', ') }}</p>
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
import { getImageUrl, getMovieDetails } from '@/services/tmdb';
import type { TMDBMovieDetail } from '@/types';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'MovieDetailPage',
    setup() {
        const route = useRoute();
        const movie = ref<TMDBMovieDetail | null>(null);
        const loading = ref(true);
        const error = ref<string | null>(null);

        const director = computed(() => {
            return movie.value?.credits?.crew.find(member => member.job === 'Director');
        });

        const importantCrew = computed(() => {
            return movie.value?.credits?.crew.filter(member => 
                ['Producer', 'Screenplay', 'Original Music Composer'].includes(member.job)
            ) || [];
        });

        const fetchMovieData = async () => {
            const movieId = Number(route.params.id);
            if (!movieId) {
                error.value = '無效的電影 ID';
                return;
            }

            try {
                loading.value = true;
                error.value = null;
                movie.value = await getMovieDetails(movieId);
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

        const getTMDBPersonUrl = (personId: number) => {
            return `https://www.themoviedb.org/person/${personId}`;
        };

        onMounted(fetchMovieData);

        return {
            movie,
            loading,
            error,
            director,
            importantCrew,
            getImageUrl,
            formatDate,
            formatRuntime,
            formatCurrency,
            fetchMovieData,
            getTMDBPersonUrl
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
    background: rgba(255,255,255,0.2);
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

.cast-section, .crew-section, .production-info {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.cast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.cast-card {
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.cast-card:hover {
    transform: translateY(-5px);
}

.actor-photo {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.actor-info {
    padding: 1rem;
}

.actor-info h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #2c3e50;
}

.actor-info p {
    margin: 0.5rem 0 0;
    color: #666;
    font-size: 0.9rem;
}

.crew-info {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.crew-member h3 {
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.crew-member p {
    color: #666;
}

.production-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.info-item h3 {
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.info-item p {
    color: #666;
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

.actor-link {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
}

.actor-link:hover .actor-photo {
    opacity: 0.8;
}

.actor-link:hover .actor-info h3 {
    color: #3498db;
}

.actor-photo {
    transition: opacity 0.3s ease;
}
</style> 