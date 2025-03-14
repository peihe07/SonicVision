<template>
  <div class="spotify-search">
    <div class="search-container">
      <div class="search-input-group">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="搜尋音樂..."
          class="search-input"
        />
        <button 
          @click="performSearch" 
          class="search-button"
          :disabled="loading || !searchQuery.trim()"
        >
          <span v-if="!loading">搜尋</span>
          <span v-else>搜尋中...</span>
        </button>
      </div>
    </div>

    <div class="results-container" v-if="searchResults.length">
      <div v-for="track in searchResults" :key="track.id" class="track-item">
        <img :src="track.album.images[1]?.url" class="track-image" />
        <div class="track-info">
          <h3>{{ track.name }}</h3>
          <p>{{ track.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
        <div class="track-controls">
          <button
            @click="playPreview(track)"
            :class="['play-button', { 'playing': currentlyPlaying === track.id }]"
          >
            {{ currentlyPlaying === track.id ? '暫停' : '播放' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>搜尋中...</p>
    </div>

    <div v-if="!loading && searchQuery && !searchResults.length" class="no-results">
      找不到相關結果
    </div>

    <audio ref="audioPlayer" @ended="handleAudioEnded"></audio>
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from 'vue';
import { getPreviewUrl, searchSpotify } from '../services/spotify';

export default {
  name: 'SpotifySearch',
  setup() {
    const searchQuery = ref('');
    const searchResults = ref([]);
    const loading = ref(false);
    const audioPlayer = ref(null);
    const currentlyPlaying = ref(null);

    const performSearch = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
      }

      loading.value = true;
      try {
        const response = await searchSpotify(searchQuery.value);
        if (response && response.tracks && Array.isArray(response.tracks.items)) {
          searchResults.value = response.tracks.items;
        } else {
          searchResults.value = [];
          console.error('無效的搜尋結果格式:', response);
        }
      } catch (error) {
        console.error('搜尋失敗:', error);
        searchResults.value = [];
      } finally {
        loading.value = false;
      }
    };

    const playPreview = async (track) => {
      if (currentlyPlaying.value === track.id) {
        audioPlayer.value.pause();
        currentlyPlaying.value = null;
        return;
      }

      try {
        const previewUrl = await getPreviewUrl(track.id);
        if (!previewUrl) {
          alert('此歌曲無試聽版本');
          return;
        }

        audioPlayer.value.src = previewUrl;
        audioPlayer.value.play();
        currentlyPlaying.value = track.id;
      } catch (error) {
        console.error('播放失敗:', error);
      }
    };

    const handleAudioEnded = () => {
      currentlyPlaying.value = null;
    };

    onBeforeUnmount(() => {
      if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value.src = '';
      }
    });

    return {
      searchQuery,
      searchResults,
      loading,
      audioPlayer,
      currentlyPlaying,
      performSearch,
      playPreview,
      handleAudioEnded
    };
  }
};
</script>

<style scoped>
.spotify-search {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input-group {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #1DB954;
}

.search-button {
  padding: 0 24px;
  font-size: 16px;
  background: #1DB954;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover:not(:disabled) {
  background: #1ed760;
  transform: translateY(-1px);
}

.search-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.track-item:hover {
  transform: translateY(-2px);
}

.track-image {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  margin-right: 16px;
}

.track-info {
  flex: 1;
}

.track-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.track-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.track-controls {
  margin-left: 16px;
}

.play-button {
  padding: 8px 16px;
  background: #1DB954;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.play-button:hover {
  background: #1ed760;
}

.play-button.playing {
  background: #ff5722;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 10px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1DB954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}
</style> 