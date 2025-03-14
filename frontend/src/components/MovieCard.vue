<template>
    <div class="movie-card">
        <img :src="posterUrl" :alt="movie.title" class="movie-poster">
        <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <div class="movie-details">
                <span class="rating">⭐ {{ rating.toFixed(1) }}</span>
                <span class="release-date">📅 {{ formattedDate }}</span>
            </div>
            <router-link :to="{ name: 'movie-detail', params: { id: movie.id }}" class="view-details">
                查看詳情
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { getImageUrl } from '@/services/tmdb';
import type { Movie } from '@/types';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'MovieCard',
    props: {
        movie: {
            type: Object as PropType<Movie>,
            required: true
        }
    },
    computed: {
        posterUrl(): string {
            return getImageUrl(this.movie.poster_path, 'w500');
        },
        rating(): number {
            return this.movie.vote_average;
        },
        formattedDate(): string {
            const date = new Date(this.movie.release_date);
            return date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
});
</script>

<style scoped>
.movie-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.movie-card:hover {
    transform: translateY(-5px);
}

.movie-poster {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.movie-info {
    padding: 1rem;
}

.movie-info h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #2c3e50;
}

.movie-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
}

.view-details {
    display: block;
    text-align: center;
    padding: 0.5rem;
    background: #42b883;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.view-details:hover {
    background: #3aa876;
}
</style> 