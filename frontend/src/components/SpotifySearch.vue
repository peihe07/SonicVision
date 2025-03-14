<template>
  <div class="spotify-search">
    <div 
      class="results-container" 
      v-if="searchResults.length"
      @scroll="handleScroll"
    >
      <div v-for="track in searchResults" :key="track.id" class="track-item">
        <a :href="getSpotifyTrackUrl(track.id)" target="_blank" rel="noopener noreferrer" class="track-link">
          <img 
            :src="track.album.images[1]?.url" 
            class="track-image"
            loading="lazy"
            :alt="track.name"
          />
          <div class="track-info">
            <h3>{{ track.name }}</h3>
            <p>{{ track.artists.map(artist => artist.name).join(', ') }}</p>
            <p class="album-name">Album: {{ track.album.name }}</p>
          </div>
        </a>
        <div class="track-controls">
          <button
            @click="playPreview(track)"
            :class="['play-button', { 'playing': currentlyPlaying === track.id }]"
            :disabled="loading"
          >
            {{ currentlyPlaying === track.id ? 'Pause' : 'Play' }}
          </button>
        </div>
      </div>

      <div v-if="loadingMore" class="loading-more">
        <div class="spinner"></div>
        <p>Loading more...</p>
      </div>
    </div>

    <div v-if="loading && !loadingMore" class="loading">
      <div class="spinner"></div>
      <p>Searching...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div 
      v-if="!loading && !loadingMore && searchQuery && !searchResults.length" 
      class="no-results"
    >
      No results found
    </div>

    <audio ref="audioPlayer" @ended="handleAudioEnded"></audio>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { onBeforeUnmount, ref, watch } from 'vue';
import { searchSpotify } from '../services/spotify';

export default {
  name: 'SpotifySearch',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeType: {
      type: String,
      default: 'all'
    }
  },
  setup(props) {
    const searchResults = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const audioPlayer = ref(null);
    const currentlyPlaying = ref(null);
    const page = ref(1);
    const hasMore = ref(true);
    const loadingMore = ref(false);

    const debouncedSearch = debounce(async () => {
      if (!props.searchQuery.trim() || (props.activeType !== 'all' && props.activeType !== 'music')) {
        searchResults.value = [];
        return;
      }

      loading.value = true;
      error.value = null;
      page.value = 1;

      try {
        const response = await searchSpotify(props.searchQuery, { page: 1 });
        if (response?.tracks?.items) {
          searchResults.value = response.tracks.items;
          hasMore.value = response.tracks.hasMore || false;
        } else {
          searchResults.value = [];
          hasMore.value = false;
        }
      } catch (err) {
        error.value = 'Search failed. Please try again later.';
        console.error('Search error:', err);
      } finally {
        loading.value = false;
      }
    }, 300);

    const loadMore = async () => {
      if (loadingMore.value || !hasMore.value) return;

      loadingMore.value = true;
      const nextPage = page.value + 1;

      try {
        const response = await searchSpotify(props.searchQuery, { page: nextPage });
        if (response?.tracks?.items) {
          searchResults.value = [...searchResults.value, ...response.tracks.items];
          hasMore.value = response.tracks.hasMore || false;
          page.value = nextPage;
        }
      } catch (err) {
        error.value = 'Failed to load more. Please try again later.';
        console.error('Load more error:', err);
      } finally {
        loadingMore.value = false;
      }
    };

    const playPreview = async (track) => {
      try {
        if (currentlyPlaying.value === track.id) {
          audioPlayer.value.pause();
          currentlyPlaying.value = null;
          return;
        }

        if (!track.preview_url) {
          throw new Error('No preview available');
        }

        if (audioPlayer.value) {
          audioPlayer.value.pause();
          audioPlayer.value.src = track.preview_url;
          try {
            await audioPlayer.value.play();
            currentlyPlaying.value = track.id;
          } catch (playError) {
            throw new Error('Failed to play. Please try again later.');
          }
        }
      } catch (err) {
        error.value = err.message;
        console.error('Playback error:', err);
        
        setTimeout(() => {
          error.value = null;
        }, 3000);
        
        if (audioPlayer.value) {
          audioPlayer.value.pause();
          audioPlayer.value.src = '';
        }
        currentlyPlaying.value = null;
      }
    };

    const handleAudioEnded = () => {
      currentlyPlaying.value = null;
    };

    const handleScroll = debounce((e) => {
      const element = e.target;
      if (element.scrollHeight - element.scrollTop - element.clientHeight < 50) {
        loadMore();
      }
    }, 200);

    const getSpotifyTrackUrl = (trackId) => {
      return `https://open.spotify.com/track/${trackId}`;
    };

    watch(() => props.searchQuery, (newQuery) => {
      if (newQuery) {
        debouncedSearch();
      } else {
        searchResults.value = [];
        hasMore.value = true;
        page.value = 1;
      }
    });

    watch(() => props.activeType, () => {
      debouncedSearch();
    });

    onBeforeUnmount(() => {
      if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value.src = '';
      }
    });

    return {
      searchResults,
      loading,
      loadingMore,
      error,
      audioPlayer,
      currentlyPlaying,
      hasMore,
      playPreview,
      handleAudioEnded,
      handleScroll,
      getSpotifyTrackUrl
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

.results-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.results-container::-webkit-scrollbar {
  width: 8px;
}

.results-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.results-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.results-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.track-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.track-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 20px;
  object-fit: cover;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-info h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.album-name {
  font-style: italic;
  color: #888 !important;
}

.track-controls {
  margin-left: 20px;
}

.play-button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  background: #1DB954;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.play-button:not(:disabled):hover {
  background: #1ed760;
  transform: scale(1.05);
}

.play-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.play-button.playing {
  background: #ff5722;
}

.loading, .loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading-more {
  margin-top: 10px;
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
  border-radius: 12px;
  margin-top: 20px;
  font-size: 16px;
}

.error-message {
  text-align: center;
  padding: 12px;
  margin: 20px 0;
  background: #fee;
  color: #e44;
  border-radius: 8px;
  font-size: 14px;
}

.track-link {
  display: flex;
  flex: 1;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.track-link:hover .track-info h3 {
  color: #1DB954;
}

.track-link:hover .track-image {
  opacity: 0.8;
}
</style> 