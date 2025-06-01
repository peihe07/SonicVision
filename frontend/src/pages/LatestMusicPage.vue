<template>
    <div class="latest-music-page">
        <h1 class="page-title">最新音樂</h1>
        <div class="music-grid">
            <div v-for="track in latestMusic" :key="track.id" class="music-card">
                <div class="music-card-image">
                    <img :src="track.album.images[0]?.url" :alt="track.name">
                </div>
                <div class="music-card-content">
                    <h3 class="music-title">{{ track.name }}</h3>
                    <p class="music-artist">{{track.artists.map(artist => artist.name).join(', ')}}</p>
                    <p class="music-album">{{ track.album.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import axios from 'axios'

const latestMusic = ref([])
const { showToast } = useToast()

const fetchLatestMusic = async () => {
    try {
        const response = await axios.get('/api/spotify/new-releases/')
        latestMusic.value = response.data
    } catch (error) {
        console.error('獲取最新音樂失敗:', error)
        showToast('獲取最新音樂失敗', 'error')
    }
}

onMounted(() => {
    fetchLatestMusic()
})
</script>

<style scoped>
.latest-music-page {
    padding: 2rem;
}

.page-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #2c3e50;
}

.music-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}

.music-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.music-card:hover {
    transform: translateY(-5px);
}

.music-card-image {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
}

.music-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.music-card-content {
    padding: 1rem;
}

.music-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.music-artist {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
}

.music-album {
    font-size: 0.8rem;
    color: #888;
}

@media (max-width: 768px) {
    .music-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
}
</style>