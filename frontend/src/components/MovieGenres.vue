<template>
  <div class="movie-genres">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading genres...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="genres-grid">
      <div 
        v-for="genre in genres" 
        :key="genre.id" 
        class="genre-item"
        @click="$emit('select-genre', genre.id)"
      >
        <h3>{{ genre.name_en }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getMovieGenres } from '../services/tmdb';

export default {
  name: 'MovieGenres',
  emits: ['select-genre'],
  setup() {
    const genres = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchGenres = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await getMovieGenres();
        genres.value = response.genres;
      } catch (err) {
        console.error('Failed to fetch genres:', err);
        error.value = 'Failed to load genres. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchGenres();
    });

    return {
      genres,
      loading,
      error
    };
  }
};
</script>

<style scoped>
.movie-genres {
  padding: 1rem;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.genre-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.genre-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.genre-item h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  text-transform: capitalize;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background: #fde2e2;
  border-radius: 8px;
  margin: 1rem 0;
}
</style> 