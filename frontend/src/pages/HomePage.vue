<template>
  <div class="home">
    <section class="hero">
      <h1>歡迎來到 SonicVision</h1>
      <p class="subtitle">發現精彩的音樂和電影世界</p>
      <div class="hero-buttons">
        <router-link to="/discover" class="btn btn-primary">開始探索</router-link>
        <router-link to="/about" class="btn btn-outline">了解更多</router-link>
      </div>
    </section>

    <section class="features">
      <h2>平台特色</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <i class="fas fa-compass"></i>
          <h3>探索發現</h3>
          <p>探索最新的音樂和電影，獲取詳細資訊和評論</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-star"></i>
          <h3>評分評論</h3>
          <p>分享您的觀點，為喜愛的作品撰寫評論</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-list"></i>
          <h3>個人收藏</h3>
          <p>建立專屬的音樂歌單和電影片單</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-users"></i>
          <h3>社群交流</h3>
          <p>加入討論，認識志同道合的朋友</p>
        </div>
      </div>
    </section>

    <section class="trending">
      <h2>熱門推薦</h2>
      <div class="trending-grid">
        <div class="trending-music">
          <h3>熱門音樂</h3>
          <div class="trending-items">
            <div v-if="loading" class="placeholder-item">載入中...</div>
            <div v-else-if="error" class="error-message">
              {{ error.message }}
            </div>
            <div v-else class="trending-content">
              <MusicCard
                v-for="track in trendingMusic"
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
          </div>
        </div>

        <div class="trending-movies">
          <h3>熱門電影</h3>
          <div class="trending-items">
            <div v-if="loading" class="placeholder-item">載入中...</div>
            <div v-else-if="error" class="error-message">
              {{ error.message }}
            </div>
            <div v-else class="trending-content">
              <MovieCard
                v-for="movie in trendingMovies"
                :key="movie.id"
                :movie="movie"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import MovieCard from '@/components/MovieCard.vue';
import MusicCard from '@/components/MusicCard.vue';
import type { SpotifyTrack } from '@/services/spotify';
import { getTrendingMusic as getSpotifyTrending } from '@/services/spotify';
import { getTrendingMovies as getTMDBTrending } from '@/services/tmdb';
import type { Movie } from '@/types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    MovieCard,
    MusicCard
  },
  data() {
    return {
      trendingMusic: [] as SpotifyTrack[],
      trendingMovies: [] as Movie[],
      loading: true,
      error: null as Error | null
    }
  },
  async created() {
    try {
      await this.fetchTrendingContent();
    } catch (error) {
      console.error('獲取熱門內容失敗:', error);
      this.error = error as Error;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchTrendingContent() {
      try {
        console.log('開始獲取熱門內容...');
        
        const [musicData, moviesData] = await Promise.all([
          getSpotifyTrending(),
          getTMDBTrending()
        ]);

        console.log('獲取到的音樂數據:', musicData);
        console.log('獲取到的電影數據:', moviesData);

        // 直接使用 Spotify 和 TMDB 的數據
        this.trendingMusic = musicData;
        this.trendingMovies = moviesData;

      } catch (error) {
        console.error('獲取熱門內容時發生錯誤:', error);
        throw error;
      }
    }
  }
});
</script>

<style scoped>
.home {
  padding: 2rem;
}

.hero {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #e74c3c;
  color: white;
}

.btn-outline {
  border: 2px solid white;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.features {
  padding: 4rem 0;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.trending {
  margin-top: 2rem;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.trending-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.trending-music, .trending-movies {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.trending-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.placeholder-item {
  text-align: center;
  padding: 2rem;
  background: #eee;
  border-radius: 8px;
  color: #666;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background: #fde2e2;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .trending-grid {
    grid-template-columns: 1fr;
  }
  
  .hero {
    padding: 3rem 1rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
}
</style> 