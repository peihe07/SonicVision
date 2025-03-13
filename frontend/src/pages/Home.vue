<template>
  <div class="home">
    <section class="hero">
      <h1>探索您的音樂與電影世界</h1>
      <p class="subtitle">在 SonicVision，發現新的音樂和電影，分享您的想法，連接志同道合的人</p>
      <div class="hero-buttons">
        <router-link to="/discover" class="btn btn-primary">開始探索</router-link>
        <router-link to="/register" class="btn btn-outline">立即註冊</router-link>
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
            <!-- 這裡將通過 API 動態載入熱門音樂 -->
            <div class="placeholder-item">載入中...</div>
          </div>
        </div>
        <div class="trending-movies">
          <h3>熱門電影</h3>
          <div class="trending-items">
            <!-- 這裡將通過 API 動態載入熱門電影 -->
            <div class="placeholder-item">載入中...</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 這裡將添加數據狀態
    }
  },
  methods: {
    // 這裡將添加方法
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}

.hero {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  margin: -2rem -2rem 2rem -2rem;
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

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
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
  padding: 4rem 0;
  background-color: #f8f9fa;
  margin: 2rem -2rem -2rem -2rem;
}

.trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.trending-items {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-item {
  color: #666;
  font-style: italic;
}
</style> 