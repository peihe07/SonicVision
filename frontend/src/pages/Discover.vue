<template>
  <div class="discover">
    <div class="discover-header">
      <div class="search-section">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="搜尋音樂或電影..." 
          class="search-input"
        >
        <div class="filter-buttons">
          <button 
            :class="['filter-btn', { active: activeType === 'all' }]"
            @click="setActiveType('all')"
          >全部</button>
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
          <div class="filter-group">
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
          <div class="filter-group">
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
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>載入中...</p>
        </div>
        <div v-else class="results-grid">
          <div v-for="item in filteredItems" :key="item.id" class="item-card">
            <img :src="item.image" :alt="item.title" class="item-image">
            <div class="item-info">
              <h3>{{ item.title }}</h3>
              <p class="item-meta">{{ item.type === 'music' ? '歌手：' : '年份：' }}{{ item.meta }}</p>
              <div class="item-rating">
                <span class="stars">★★★★☆</span>
                <span class="rating-number">4.2</span>
              </div>
              <button class="btn btn-primary btn-sm">查看詳情</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Discover',
  data() {
    return {
      searchQuery: '',
      activeType: 'all',
      loading: false,
      selectedMusicGenres: [],
      selectedMovieGenres: [],
      musicGenres: [
        { id: 'pop', name: '流行' },
        { id: 'rock', name: '搖滾' },
        { id: 'jazz', name: '爵士' },
        { id: 'classical', name: '古典' }
      ],
      movieGenres: [
        { id: 'action', name: '動作' },
        { id: 'comedy', name: '喜劇' },
        { id: 'drama', name: '劇情' },
        { id: 'scifi', name: '科幻' }
      ],
      items: [] // 將從 API 獲取數據
    }
  },
  computed: {
    filteredItems() {
      // 實現篩選邏輯
      return this.items
    }
  },
  methods: {
    handleSearch() {
      // 實現搜尋邏輯
    },
    setActiveType(type) {
      this.activeType = type
      // 更新搜尋結果
    }
  },
  mounted() {
    // 載入初始數據
  }
}
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

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 4px;
  background: #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #2c3e50;
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
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  position: sticky;
  top: 1rem;
}

.filter-section h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group h4 {
  margin-bottom: 1rem;
  color: #34495e;
}

.filter-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-content {
  flex: 1;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.item-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.item-info {
  padding: 1rem;
}

.item-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #2c3e50;
}

.item-meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #f1c40f;
}

.rating-number {
  color: #666;
  font-size: 0.9rem;
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
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}
</style> 