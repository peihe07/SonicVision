<template>
  <div class="discover">
    <div class="discover-header">
      <div class="search-section">
        <div class="search-input-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
            :placeholder="searchPlaceholder" 
            class="search-input"
          >
          <button class="search-btn" @click="handleSearch">
            <i class="fas fa-search"></i>
            搜尋
          </button>
        </div>
        <div class="filter-buttons">
          <button 
            :class="['filter-btn', { active: activeType === 'music' }]"
            @click="setActiveType('music')"
          >音樂</button>
          <button 
            :class="['filter-btn', { active: activeType === 'movie' }]"
            @click="setActiveType('movie')"
          >電影</button>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="sidebar">
        <div class="filter-section">
          <h3>分類篩選</h3>
          <div v-if="activeType === 'music'" class="filter-group">
            <h4>音樂類型</h4>
            <div v-for="genre in musicGenres" :key="genre.id" class="filter-item">
              <input 
                type="checkbox" 
                :id="genre.id" 
                v-model="selectedMusicGenres"
                :value="genre.id"
              >
              <label :for="genre.id">{{ genre.name }}</label>
            </div>
          </div>
          <div v-if="activeType === 'movie'" class="filter-group">
            <h4>電影類型</h4>
            <div v-for="genre in movieGenres" :key="genre.id" class="filter-item">
              <input 
                type="checkbox" 
                :id="genre.id" 
                v-model="selectedMovieGenres"
                :value="genre.id"
              >
              <label :for="genre.id">{{ genre.name }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div v-if="activeType === 'music'">
          <SpotifySearch :search-query="currentSearchQuery" :active-type="activeType" />
        </div>
        <div v-if="activeType === 'movie'">
          <MovieSearch :search-query="currentSearchQuery" :active-type="activeType" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import MovieSearch from '../components/MovieSearch.vue';
import SpotifySearch from '../components/SpotifySearch.vue';
import { getMovieGenres } from '../services/tmdb';

export default {
  name: 'DiscoverPage',
  components: {
    SpotifySearch,
    MovieSearch
  },
  setup() {
    const searchQuery = ref('');
    const currentSearchQuery = ref('');
    const activeType = ref('music');  // 預設顯示音樂搜尋
    const loading = ref(false);
    const error = ref(null);
    const selectedMusicGenres = ref([]);
    const selectedMovieGenres = ref([]);
    const movieGenres = ref([]);

    const musicGenres = [
      { id: 'pop', name: '流行' },
      { id: 'rock', name: '搖滾' },
      { id: 'jazz', name: '爵士' },
      { id: 'classical', name: '古典' }
    ];

    const searchPlaceholder = computed(() => {
      return activeType.value === 'music' ? '搜尋音樂...' : '搜尋電影...';
    });

    const handleSearch = () => {
      error.value = null;
      currentSearchQuery.value = searchQuery.value;
    };

    const setActiveType = (type) => {
      activeType.value = type;
      searchQuery.value = '';
      currentSearchQuery.value = '';
      error.value = null;
    };

    // 載入電影類型
    const fetchMovieGenres = async () => {
      try {
        const response = await getMovieGenres();
        movieGenres.value = response;
      } catch (err) {
        console.error('Error fetching movie genres:', err);
      }
    };

    onMounted(() => {
      fetchMovieGenres();
    });

    return {
      searchQuery,
      currentSearchQuery,
      activeType,
      loading,
      error,
      selectedMusicGenres,
      selectedMovieGenres,
      musicGenres,
      movieGenres,
      searchPlaceholder,
      handleSearch,
      setActiveType
    };
  }
};
</script>

<style scoped>
.discover {
  margin: -2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.discover-header {
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  max-width: 800px;
  margin: 0 auto;
}

.search-input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  background: #2980b9;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 2rem;
  border: 2px solid #3498db;
  background: transparent;
  color: #3498db;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover {
  background: rgba(52, 152, 219, 0.1);
}

.filter-btn.active {
  background: #3498db;
  color: white;
}

.content-section {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group h4 {
  margin: 0 0 0.8rem 0;
  color: #666;
  font-size: 1rem;
}

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.filter-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.filter-item label {
  color: #666;
  cursor: pointer;
}

.main-content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1024px) {
  .content-section {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .discover-header {
    padding: 1rem;
  }

  .search-input-group {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }

  .filter-buttons {
    flex-wrap: wrap;
  }

  .filter-btn {
    flex: 1;
    min-width: 120px;
  }
}
</style> 