<template>
    <div class="music-card" @click="navigateToDetail">
        <img :src="music.coverUrl" :alt="music.title" class="music-poster">
        <div class="music-info">
            <h3>{{ music.title }}</h3>
            <div class="music-details">
                <span class="artist">🎤 {{ music.artist }}</span>
                <span class="rating">⭐ {{ music.rating.toFixed(1) }}</span>
            </div>
            <div class="hover-details">
                <h4>{{ music.title }}</h4>
                <p>{{ music.artist }}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>{{ music.rating.toFixed(1) }}</span>
                </div>
            </div>
            <div class="view-details">
                點擊查看詳情
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { Music } from '@/types';
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'MusicCard',
    props: {
        music: {
            type: Object as PropType<Music>,
            required: true
        }
    },
    setup(props) {
        const router = useRouter();

        const navigateToDetail = () => {
            router.push({
                name: 'music-detail',
                params: { id: props.music.id.toString() }
            });
        };

        return {
            navigateToDetail
        };
    }
});
</script>

<style scoped>
.music-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
    cursor: pointer;
    position: relative;
}

.music-card:hover {
    transform: translateY(-5px);
}

.music-poster {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.music-info {
    padding: 1rem;
    position: relative;
}

.music-info h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.music-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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

.music-card:hover .hover-details {
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

.artist {
    color: #3498db;
    font-weight: 500;
}

.rating {
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