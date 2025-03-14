<template>
    <div class="music-detail" v-if="track">
        <div class="music-header" :style="{ backgroundImage: `url(${track.album.images[0]?.url})` }">
            <div class="overlay">
                <div class="content">
                    <img :src="track.album.images[0]?.url" :alt="track.name" class="cover">
                    <div class="info">
                        <h1>{{ track.name }}</h1>
                        <div class="meta">
                            <span class="artist">{{ track.artists[0]?.name }}</span>
                            <span class="album">專輯：{{ track.album.name }}</span>
                        </div>
                        <div class="actions">
                            <a :href="track.external_urls.spotify" target="_blank" class="spotify-link">
                                在 Spotify 上播放
                            </a>
                            <button class="add-playlist" @click="addToPlaylist">
                                加入播放清單
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-section">
            <h2>歌手資訊</h2>
            <div class="artists-grid">
                <div v-for="artist in track.artists" :key="artist.name" class="artist-card">
                    <h3>{{ artist.name }}</h3>
                </div>
            </div>
        </div>

        <div class="content-section" v-if="track.preview_url">
            <h2>試聽</h2>
            <audio controls :src="track.preview_url"></audio>
        </div>

        <div class="content-section">
            <h2>專輯資訊</h2>
            <div class="album-info">
                <img :src="track.album.images[1]?.url" :alt="track.album.name" class="album-cover">
                <div class="album-details">
                    <h3>{{ track.album.name }}</h3>
                    <p>歌手：{{ track.album.artists.map(a => a.name).join(', ') }}</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="loading" class="loading">
        <div class="spinner"></div>
        <p>載入中...</p>
    </div>
    <div v-else-if="error" class="error">
        {{ error }}
    </div>
</template>

<script lang="ts">
import type { SpotifyTrack } from '@/services/spotify';
import { searchSpotify } from '@/services/spotify';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'MusicDetailPage',
    setup() {
        const route = useRoute();
        const track = ref<SpotifyTrack | null>(null);
        const loading = ref(true);
        const error = ref<string | null>(null);

        const fetchTrackData = async () => {
            try {
                const trackId = route.params.id as string;
                if (!trackId) {
                    throw new Error('無效的音樂 ID');
                }

                loading.value = true;
                error.value = null;

                // 這裡應該使用 Spotify API 的 getTrack 端點
                // 目前暫時使用 search 來模擬
                const result = await searchSpotify(trackId);
                const foundTrack = result.items.find(t => t.id === trackId);
                
                if (!foundTrack) {
                    throw new Error('找不到該音樂');
                }

                track.value = foundTrack;
            } catch (err) {
                console.error('獲取音樂詳情失敗:', err);
                error.value = '無法載入音樂詳情，請稍後再試';
            } finally {
                loading.value = false;
            }
        };

        const addToPlaylist = async () => {
            // TODO: 實現加入播放清單功能
            alert('此功能正在開發中');
        };

        onMounted(fetchTrackData);

        return {
            track,
            loading,
            error,
            addToPlaylist
        };
    }
});
</script>

<style scoped>
.music-detail {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.music-header {
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

.cover {
    width: 300px;
    height: 300px;
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

.artist {
    color: #3498db;
}

.actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.spotify-link, .add-playlist {
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
}

.spotify-link {
    background: #1DB954;
    color: white;
}

.add-playlist {
    background: transparent;
    border: 2px solid white;
    color: white;
}

.spotify-link:hover, .add-playlist:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.content-section {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-section h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.artist-card {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
}

.album-info {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.album-cover {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
}

.album-details h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.error {
    text-align: center;
    color: #e74c3c;
    padding: 2rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .content {
        flex-direction: column;
        text-align: center;
    }

    .cover {
        margin: 0 auto;
    }

    .actions {
        justify-content: center;
    }
}
</style> 