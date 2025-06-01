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
              <MusicCard v-for="track in trendingMusic" :key="track.id" :music="{
                id: track.id,
                title: track.name,
                artist: track.artists[0].name,
                coverUrl: track.album.images[0]?.url || '',
                rating: 4.5,
                spotifyUrl: track.external_urls.spotify,
                youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.name} ${track.artists[0].name}`)}`
              }" />
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
              <MovieCard v-for="movie in trendingMovies" :key="movie.id" :movie="movie">
                <div class="movie-details">
                  <h4>{{ movie.title }}</h4>
                  <p>{{ movie.release_date?.split('-')[0] }}</p>
                  <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>{{ movie.vote_average?.toFixed(1) }}</span>
                  </div>
                </div>
              </MovieCard>
            </div>
          </div>
        </div>
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
  </div>
</template>

<script lang="ts">
import MovieCard from '@/components/MovieCard.vue';
import MusicCard from '@/components/MusicCard.vue';
import { spotifyAPI } from '@/api/spotify';
import type { SpotifyTrack } from '@/api/spotify';
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

        const [music, movies] = await Promise.all([
          spotifyAPI.getTrendingMusic().catch(error => {
            console.error('獲取熱門音樂失敗:', error);
            return [] as SpotifyTrack[];
          }),
          getTMDBTrending().catch(error => {
            console.error('獲取熱門電影失敗:', error);
            return [] as Movie[];
          })
        ]);

        console.log('獲取到的音樂數據:', music);
        console.log('獲取到的電影數據:', movies);

        this.trendingMusic = music;
        this.trendingMovies = movies;

      } catch (error) {
        console.error('獲取熱門內容時發生錯誤:', error);
        // 不顯示錯誤提示，因為我們已經在各自的 API 調用中處理了錯誤
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.trending-music,
.trending-movies {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trending-music:hover,
.trending-movies:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.trending-music h3,
.trending-movies h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.trending-items {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.trending-content {
  display: grid;
  gap: 1.5rem;
  flex: 1;
}

.trending-movies .trending-content {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-items: center;
  align-items: center;
}

.trending-music .trending-content {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-items: center;
  align-items: center;
}

.trending-movies .trending-content>* {
  aspect-ratio: 2/3;
  width: 100%;
  max-width: 240px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.trending-movies .trending-content>*:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.trending-movies .trending-content>*:hover .movie-details {
  opacity: 1;
  transform: translateY(0);
}

.trending-music .trending-content>* {
  aspect-ratio: 1/1;
  width: 100%;
  max-width: 220px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.trending-music .trending-content>*:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.trending-music .trending-content>*:hover .music-details {
  opacity: 1;
  transform: translateY(0);
}

.movie-details,
.music-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.movie-details h4,
.music-details h4 {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-details p,
.music-details p {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.rating i {
  color: #f1c40f;
}

.placeholder-item {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  color: #666;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 1.5rem;
  background: #fde2e2;
  border-radius: 12px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.1);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

@media (max-width: 768px) {
  .trending-grid {
    grid-template-columns: 1fr;
  }

  .trending-music,
  .trending-movies {
    border-radius: 12px;
    padding: 1.5rem;
  }

  .trending-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .trending-movies .trending-content {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  .trending-music .trending-content {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  .trending-movies .trending-content>*,
  .trending-music .trending-content>* {
    border-radius: 8px;
  }

  .hero {
    padding: 3rem 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .movie-details,
  .music-details {
    padding: 0.75rem;
  }

  .movie-details h4,
  .music-details h4 {
    font-size: 0.9rem;
  }

  .movie-details p,
  .music-details p {
    font-size: 0.8rem;
  }
}
</style>