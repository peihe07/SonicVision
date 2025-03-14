<template>
  <div class="movie-search">
    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>正在搜尋電影...</p>
    </div>

    <!-- 錯誤信息 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 搜索結果 -->
    <div v-if="!loading && movies.length > 0" class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <div class="movie-poster">
          <img 
            :src="movie.poster_path ? getImageUrl(movie.poster_path, 'w500') : '/images/no-poster.png'"
            :alt="movie.title"
            @error="handleImageError"
          >
        </div>
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <p class="release-date">{{ formatDate(movie.release_date) }}</p>
          <div class="rating">
            <span class="stars">★</span>
            <span class="rating-value">{{ movie.vote_average.toFixed(1) }}</span>
          </div>
          <p class="overview">{{ truncateText(movie.overview, 150) }}</p>
          <button class="details-btn" @click="showMovieDetails(movie)">查看詳情</button>
        </div>
      </div>
    </div>

    <!-- 無結果提示 -->
    <div v-if="!loading && searchQuery && movies.length === 0" class="no-results">
      <p>沒有找到相關電影</p>
    </div>

    <!-- 載入更多按鈕 -->
    <div v-if="hasMorePages" class="load-more">
      <button @click="loadMore" :disabled="loading">
        載入更多
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getImageUrl, searchMovies } from '../services/tmdb';

export default {
  name: 'MovieSearch',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeType: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const movies = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const hasMorePages = ref(false);

    const searchMoviesData = async (page = 1) => {
      if (!props.searchQuery || props.activeType === 'music') {
        movies.value = [];
        return;
      }

      try {
        loading.value = true;
        error.value = null;
        const response = await searchMovies(props.searchQuery, page);
        
        if (page === 1) {
          movies.value = response.results;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          movies.value = [...movies.value, ...response.results];
        }
        
        totalPages.value = response.total_pages;
        hasMorePages.value = page < response.total_pages;
        currentPage.value = page;
      } catch (err) {
        console.error('搜索電影時出錯:', err);
        error.value = '搜索電影時發生錯誤，請稍後再試';
      } finally {
        loading.value = false;
      }
    };

    const loadMore = () => {
      if (hasMorePages.value && !loading.value) {
        searchMoviesData(currentPage.value + 1);
      }
    };

    const handleImageError = (event) => {
      event.target.src = '/images/no-poster.png';
    };

    const formatDate = (dateString) => {
      if (!dateString) return '暫無日期';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength 
        ? text.substring(0, maxLength) + '...'
        : text;
    };

    const showMovieDetails = (movie) => {
      router.push(`/movie/${movie.id}`);
    };

    watch(() => props.searchQuery, (newQuery, oldQuery) => {
      if (newQuery !== oldQuery && props.activeType !== 'music') {
        currentPage.value = 1;
        searchMoviesData(1);
      }
    });

    watch(() => props.activeType, (newType, oldType) => {
      if (newType !== oldType && newType === 'movie' && props.searchQuery) {
        currentPage.value = 1;
        searchMoviesData(1);
      }
    });

    return {
      movies,
      loading,
      error,
      hasMorePages,
      getImageUrl,
      loadMore,
      handleImageError,
      formatDate,
      truncateText,
      showMovieDetails
    };
  }
};
</script>

<style scoped>
.movie-search {
  padding: 1rem 0;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  position: relative;
  padding-top: 150%;
}

.movie-poster img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-info {
  padding: 1.5rem;
}

.movie-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.release-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stars {
  color: #f1c40f;
}

.rating-value {
  color: #666;
  font-size: 0.9rem;
}

.overview {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.details-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.details-btn:hover {
  background: #2980b9;
}

.loading-state {
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

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.load-more button {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.load-more button:hover {
  background: #34495e;
}

.load-more button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style> 