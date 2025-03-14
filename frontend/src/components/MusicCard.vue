<template>
    <div class="music-card">
        <img :src="music.coverUrl" :alt="music.title" class="music-poster">
        <div class="music-info">
            <h3>{{ music.title }}</h3>
            <div class="music-details">
                <span class="artist">🎤 {{ music.artist }}</span>
                <span class="rating">⭐ {{ music.rating.toFixed(1) }}</span>
            </div>
            <div v-if="music.genre" class="genre">
                🎵 {{ music.genre }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { Music } from '@/types';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'MusicCard',
    props: {
        music: {
            type: Object as PropType<Music>,
            required: true
        }
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

.artist {
    color: #3498db;
    font-weight: 500;
}

.rating {
    color: #f1c40f;
}

.genre {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 0.5rem;
    padding: 0.25rem 0;
    border-top: 1px solid #eee;
}
</style> 