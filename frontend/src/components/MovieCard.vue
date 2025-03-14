<template>
    <div class="movie-card" @click="navigateToDetail">
        <img :src="posterUrl" :alt="movie.title" class="movie-poster">
        <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <div class="movie-details">
                <span class="rating">⭐ {{ rating.toFixed(1) }}</span>
                <span class="release-date">📅 {{ formattedDate }}</span>
            </div>
            <div class="hover-details">
                <h4>{{ movie.title }}</h4>
                <p>{{ movie.releaseDate?.split('-')[0] }}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>{{ movie.voteAverage?.toFixed(1) }}</span>
                </div>
            </div>
            <div class="view-details">
                點擊查看詳情
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getImageUrl } from '@/services/tmdb';
import type { Movie } from '@/types';
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'MovieCard',
    props: {
        movie: {
            type: Object as PropType<Movie>,
            required: true
        }
    },
    setup(props) {
        const router = useRouter();

        const navigateToDetail = () => {
            router.push({
                name: 'movie-detail',
                params: { id: props.movie.id.toString() }
            });
        };

        return {
            navigateToDetail,
            getImageUrl
        };
    },
    computed: {
        posterUrl(): string {
            return getImageUrl(this.movie.posterPath, 'w500');
        },
        rating(): number {
            return this.movie.voteAverage;
        },
        formattedDate(): string {
            const date = new Date(this.movie.releaseDate);
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
    position: relative;
    cursor: pointer;
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
    position: relative;
}

.movie-info h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.movie-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
}

.hover-details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 1;
}

.movie-card:hover .hover-details {
    transform: translateY(0);
}

.hover-details h4 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hover-details p {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
    opacity: 0.8;
}

.hover-details .rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.hover-details .rating i {
    color: #f1c40f;
}

.view-details {
    font-size: 0.8rem;
    color: #3498db;
    text-align: center;
    padding: 0.5rem;
    border-top: 1px solid #eee;
    margin-top: 0.5rem;
}

.view-details:hover {
    background-color: #f8f9fa;
}
</style> 