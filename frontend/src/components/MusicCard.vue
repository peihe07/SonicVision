<template>
    <div class="music-card" @click="handleCardClick">
        <img :src="music.coverUrl" :alt="music.title" class="music-poster">
        <div class="music-info">
            <h3>{{ music.title }}</h3>
            <div class="music-details">
                <span class="artist">🎤 {{ music.artist }}</span>
                <span class="rating">⭐ {{ music.rating.toFixed(1) }}</span>
            </div>
            <div class="play-buttons" @click.stop>
                <a v-if="music.youtubeUrl" 
                   :href="music.youtubeUrl" 
                   target="_blank" 
                   class="play-button youtube">
                    <i class="fab fa-youtube"></i> YouTube
                </a>
                <div v-if="!music.spotifyUrl && !music.youtubeUrl" class="no-link">
                    暫無播放連結
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { Music } from '@/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MusicCard',
    props: {
        music: {
            type: Object as PropType<Music>,
            required: true
        }
    },
    methods: {
        handleCardClick() {
            if (this.music.spotifyUrl) {
                window.open(this.music.spotifyUrl, '_blank');
            }
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
    position: relative;
    cursor: pointer;
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
    margin-bottom: 1rem;
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

.play-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.play-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.play-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.spotify {
    background-color: #1DB954;
    color: white;
}

.spotify:hover {
    background-color: #1ed760;
}

.youtube {
    background-color: #FF0000;
    color: white;
}

.youtube:hover {
    background-color: #ff1a1a;
}

.no-link {
    text-align: center;
    padding: 0.75rem;
    color: #666;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-size: 0.9rem;
}
</style> 