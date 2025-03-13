<template>
  <div class="api-test-page">
    <h1>API 測試</h1>
    
    <!-- Spotify API 測試 -->
    <section class="test-section">
      <h2>Spotify API 測試</h2>
      
      <div class="test-group">
        <h3>音樂搜索</h3>
        <div class="input-group">
          <input 
            type="text" 
            v-model="musicQuery" 
            placeholder="輸入歌曲名稱"
            @keyup.enter="searchMusicTest"
          >
          <button @click="searchMusicTest" :disabled="loading.music">
            {{ loading.music ? '搜索中...' : '搜索' }}
          </button>
        </div>
        <div class="result-box" v-if="results.music">
          <pre>{{ JSON.stringify(results.music, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-group">
        <h3>獲取藝術家資訊</h3>
        <div class="input-group">
          <input 
            type="text" 
            v-model="artistId" 
            placeholder="輸入藝術家 ID"
            @keyup.enter="getArtistTest"
          >
          <button @click="getArtistTest" :disabled="loading.artist">
            {{ loading.artist ? '獲取中...' : '獲取' }}
          </button>
        </div>
        <div class="result-box" v-if="results.artist">
          <pre>{{ JSON.stringify(results.artist, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- TMDB API 測試 -->
    <section class="test-section">
      <h2>TMDB API 測試</h2>
      
      <div class="test-group">
        <h3>電影搜索</h3>
        <div class="input-group">
          <input 
            type="text" 
            v-model="movieQuery" 
            placeholder="輸入電影名稱"
            @keyup.enter="searchMoviesTest"
          >
          <button @click="searchMoviesTest" :disabled="loading.movies">
            {{ loading.movies ? '搜索中...' : '搜索' }}
          </button>
        </div>
        <div class="result-box" v-if="results.movies">
          <pre>{{ JSON.stringify(results.movies, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-group">
        <h3>獲取電影詳情</h3>
        <div class="input-group">
          <input 
            type="text" 
            v-model="movieId" 
            placeholder="輸入電影 ID"
            @keyup.enter="getMovieTest"
          >
          <button @click="getMovieTest" :disabled="loading.movie">
            {{ loading.movie ? '獲取中...' : '獲取' }}
          </button>
        </div>
        <div class="result-box" v-if="results.movie">
          <pre>{{ JSON.stringify(results.movie, null, 2) }}</pre>
        </div>
      </div>

      <div class="test-group">
        <h3>獲取正在上映的電影</h3>
        <button @click="getNowPlayingTest" :disabled="loading.nowPlaying">
          {{ loading.nowPlaying ? '獲取中...' : '獲取正在上映' }}
        </button>
        <div class="result-box" v-if="results.nowPlaying">
          <pre>{{ JSON.stringify(results.nowPlaying, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- 錯誤提示 -->
    <div class="error-message" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import spotifyApi from '@/services/spotify'
import tmdbApi from '@/services/tmdb'

export default {
  name: 'ApiTest',
  data() {
    return {
      // 搜索參數
      musicQuery: '',
      movieQuery: '',
      artistId: '',
      movieId: '',

      // 載入狀態
      loading: {
        music: false,
        artist: false,
        movies: false,
        movie: false,
        nowPlaying: false
      },

      // 結果
      results: {
        music: null,
        artist: null,
        movies: null,
        movie: null,
        nowPlaying: null
      },

      // 錯誤訊息
      error: null
    }
  },
  methods: {
    // Spotify API 測試方法
    async searchMusicTest() {
      if (!this.musicQuery.trim()) {
        this.error = '請輸入搜索關鍵字'
        return
      }

      try {
        this.loading.music = true
        this.error = null
        const result = await spotifyApi.searchMusic(this.musicQuery)
        this.results.music = result
      } catch (err) {
        this.error = `搜索音樂失敗: ${err.message}`
        console.error('Search music error:', err)
      } finally {
        this.loading.music = false
      }
    },

    async getArtistTest() {
      if (!this.artistId.trim()) {
        this.error = '請輸入藝術家 ID'
        return
      }

      try {
        this.loading.artist = true
        this.error = null
        const result = await spotifyApi.getArtistDetails(this.artistId)
        this.results.artist = result
      } catch (err) {
        this.error = `獲取藝術家資訊失敗: ${err.message}`
        console.error('Get artist error:', err)
      } finally {
        this.loading.artist = false
      }
    },

    // TMDB API 測試方法
    async searchMoviesTest() {
      if (!this.movieQuery.trim()) {
        this.error = '請輸入搜索關鍵字'
        return
      }

      try {
        this.loading.movies = true
        this.error = null
        const result = await tmdbApi.searchMovies(this.movieQuery)
        this.results.movies = result
      } catch (err) {
        this.error = `搜索電影失敗: ${err.message}`
        console.error('Search movies error:', err)
      } finally {
        this.loading.movies = false
      }
    },

    async getMovieTest() {
      if (!this.movieId.trim()) {
        this.error = '請輸入電影 ID'
        return
      }

      try {
        this.loading.movie = true
        this.error = null
        const result = await tmdbApi.getMovieDetails(this.movieId)
        this.results.movie = result
      } catch (err) {
        this.error = `獲取電影詳情失敗: ${err.message}`
        console.error('Get movie error:', err)
      } finally {
        this.loading.movie = false
      }
    },

    async getNowPlayingTest() {
      try {
        this.loading.nowPlaying = true
        this.error = null
        const result = await tmdbApi.getNowPlayingMovies()
        this.results.nowPlaying = result
      } catch (err) {
        this.error = `獲取正在上映電影失敗: ${err.message}`
        console.error('Get now playing movies error:', err)
      } finally {
        this.loading.nowPlaying = false
      }
    }
  }
}
</script>

<style scoped>
.api-test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.test-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.test-group {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #34495e;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  border-color: #3498db;
  outline: none;
}

button {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #2980b9;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.result-box {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  overflow-x: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 0.9rem;
  color: #2c3e50;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
}
</style> 