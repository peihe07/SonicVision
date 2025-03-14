<template>
  <div class="discover">
    <section class="search-section">
      <h1>探索音樂與電影</h1>
      <div class="search-container">
        <div class="search-input">
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="activeType === 'music' ? '搜索音樂...' : '搜索電影...'"
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch" class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="search-type">
          <button 
            :class="['type-button', { active: activeType === 'music' }]"
            @click="setActiveType('music')"
          >
            音樂
          </button>
          <button 
            :class="['type-button', { active: activeType === 'movie' }]"
            @click="setActiveType('movie')"
          >
            電影
          </button>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>搜索中...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else>
      <section v-if="activeType === 'music'" class="results-section">
        <div v-if="musicResults.length > 0" class="results-grid">
          <MusicCard
            v-for="track in musicResults"
            :key="track.id"
            :music="{
              id: track.id,
              title: track.name,
              artist: track.artists[0].name,
              coverUrl: track.album.images[0]?.url || '',
              rating: 4.5
            }"
          />
        </div>
        <div v-else-if="hasSearched" class="no-results">
          找不到相關音樂
        </div>
      </section>

      <section v-else class="results-section">
        <div v-if="movieResults.length > 0" class="results-grid">
          <MovieCard
            v-for="movie in movieResults"
            :key="movie.id"
            :movie="movie"
          />
        </div>
        <div v-else-if="hasSearched" class="no-results">
          找不到相關電影
        </div>
      </section>
    </div>

    <div v-if="hasMore && !loading" class="load-more">
      <button @click="loadMore" class="load-more-button">
        載入更多
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import MovieCard from '@/components/MovieCard.vue';
import MusicCard from '@/components/MusicCard.vue';
import type { SpotifyTrack } from '@/services/spotify';
import { searchSpotify } from '@/services/spotify';
import { searchMovies } from '@/services/tmdb';
import type { Movie } from '@/types';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'DiscoverPage',
  components: {
    MusicCard,
    MovieCard
  },
  setup() {
    const searchQuery = ref('');
    const activeType = ref<'music' | 'movie'>('music');
    const loading = ref(false);
    const error = ref<string | null>(null);
    const currentPage = ref(1);
    const hasMore = ref(false);
    const hasSearched = ref(false);
    const musicResults = ref<SpotifyTrack[]>([]);
    const movieResults = ref<Movie[]>([]);

    const handleSearch = async () => {
      if (!searchQuery.value.trim()) return;

      try {
        loading.value = true;
        error.value = null;
        currentPage.value = 1;
        hasSearched.value = true;

        if (activeType.value === 'music') {
          const result = await searchSpotify(searchQuery.value.trim(), 1);
          musicResults.value = result.items;
          hasMore.value = result.hasMore;
        } else {
          const result = await searchMovies(searchQuery.value.trim(), 1);
          movieResults.value = result.results;
          hasMore.value = currentPage.value < result.total_pages;
        }
      } catch (err) {
        console.error('搜索失敗:', err);
        error.value = '搜索時發生錯誤，請稍後再試';
      } finally {
        loading.value = false;
      }
    };

    const loadMore = async () => {
      if (loading.value) return;

      try {
        loading.value = true;
        const nextPage = currentPage.value + 1;

        if (activeType.value === 'music') {
          const result = await searchSpotify(searchQuery.value.trim(), nextPage);
          musicResults.value = [...musicResults.value, ...result.items];
          hasMore.value = result.hasMore;
        } else {
          const result = await searchMovies(searchQuery.value.trim(), nextPage);
          movieResults.value = [...movieResults.value, ...result.results];
          hasMore.value = nextPage < result.total_pages;
        }

        currentPage.value = nextPage;
      } catch (err) {
        console.error('載入更多結果失敗:', err);
        error.value = '載入更多結果時發生錯誤';
      } finally {
        loading.value = false;
      }
    };

    const setActiveType = (type: 'music' | 'movie') => {
      if (activeType.value !== type) {
        activeType.value = type;
        musicResults.value = [];
        movieResults.value = [];
        hasMore.value = false;
        hasSearched.value = false;
        currentPage.value = 1;
        error.value = null;
        if (searchQuery.value.trim()) {
          handleSearch();
        }
      }
    };

    watch(searchQuery, () => {
      if (!searchQuery.value.trim()) {
        musicResults.value = [];
        movieResults.value = [];
        hasMore.value = false;
        hasSearched.value = false;
        error.value = null;
      }
    });

    return {
      searchQuery,
      activeType,
      loading,
      error,
      hasMore,
      hasSearched,
      musicResults,
      movieResults,
      handleSearch,
      loadMore,
      setActiveType
    };
  }
});
</script>

<style scoped>
.discover {
  padding: 2rem;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.search-section {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.search-button {
  padding: 0 1.5rem;
  border: none;
  border-radius: 25px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.search-type {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.type-button {
  padding: 0.5rem 2rem;
  border: 2px solid #3498db;
  border-radius: 20px;
  background: transparent;
  color: #3498db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-button.active {
  background: #3498db;
  color: white;
}

.type-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-section {
  margin-top: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

.error-message {
  text-align: center;
  color: #e74c3c;
  padding: 2rem;
  background: #fde2e2;
  border-radius: 8px;
  margin: 2rem 0;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-style: italic;
}

.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more-button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .discover {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .search-input {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
    padding: 1rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style> 