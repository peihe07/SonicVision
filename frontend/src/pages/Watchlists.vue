<template>
  <div class="watchlists-page">
    <div class="page-header">
      <h1>我的片單</h1>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i> 創建新片單
      </button>
    </div>

    <div class="watchlists-grid" v-if="!loading && watchlists.length">
      <div v-for="watchlist in watchlists" :key="watchlist.id" class="watchlist-card">
        <div class="watchlist-cover" :style="{ backgroundImage: `url(${watchlist.coverUrl || '/default-watchlist.jpg'})` }">
          <div class="watchlist-overlay">
            <button class="btn btn-view" @click="viewWatchlist(watchlist.id)">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="watchlist-info">
          <h3>{{ watchlist.name }}</h3>
          <p class="watchlist-meta">{{ watchlist.movieCount }} 部電影 • {{ formatDate(watchlist.updatedAt) }}</p>
          <div class="progress-bar" v-if="watchlist.movieCount > 0">
            <div class="progress" :style="{ width: `${(watchlist.watchedCount / watchlist.movieCount) * 100}%` }"></div>
          </div>
          <p class="progress-text" v-if="watchlist.movieCount > 0">
            已觀看 {{ watchlist.watchedCount }}/{{ watchlist.movieCount }}
          </p>
          <div class="watchlist-actions">
            <button class="btn btn-icon" @click="editWatchlist(watchlist)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon" @click="deleteWatchlist(watchlist.id)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else-if="!loading && !watchlists.length">
      <i class="fas fa-film"></i>
      <h2>還沒有片單</h2>
      <p>創建一個片單，開始收藏想看的電影吧！</p>
      <button class="btn btn-primary" @click="showCreateModal = true">
        創建片單
      </button>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 創建/編輯片單模態框 -->
    <div class="modal" v-if="showCreateModal || showEditModal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <h2>{{ showEditModal ? '編輯片單' : '創建新片單' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="watchlistName">片單名稱</label>
            <input
              type="text"
              id="watchlistName"
              v-model="form.name"
              required
              class="form-control"
              placeholder="為您的片單取個名字"
            >
          </div>
          <div class="form-group">
            <label for="watchlistDescription">描述</label>
            <textarea
              id="watchlistDescription"
              v-model="form.description"
              class="form-control"
              rows="3"
              placeholder="描述一下這個片單..."
            ></textarea>
          </div>
          <div class="form-group">
            <label for="watchlistCover">封面圖片</label>
            <input
              type="file"
              id="watchlistCover"
              @change="handleCoverUpload"
              accept="image/*"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.isPublic">
              <span>公開片單</span>
            </label>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" @click="closeModal">取消</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ showEditModal ? '更新' : '創建' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 確認刪除模態框 -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <h2>確認刪除</h2>
        <p>確定要刪除這個片單嗎？此操作無法復原。</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-danger" @click="confirmDelete" :disabled="loading">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watchlists } from '@/services/api'

export default {
  name: 'Watchlists',
  data() {
    return {
      watchlists: [],
      loading: false,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedWatchlistId: null,
      form: {
        name: '',
        description: '',
        coverFile: null,
        isPublic: true
      }
    }
  },
  methods: {
    async fetchWatchlists() {
      try {
        this.loading = true
        const response = await watchlists.getAll()
        this.watchlists = response.data
      } catch (err) {
        console.error('Failed to fetch watchlists:', err)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-TW')
    },
    handleCoverUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.coverFile = file
      }
    },
    async handleSubmit() {
      try {
        this.loading = true
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('description', this.form.description)
        formData.append('isPublic', this.form.isPublic)
        if (this.form.coverFile) {
          formData.append('cover', this.form.coverFile)
        }

        if (this.showEditModal) {
          await watchlists.update(this.selectedWatchlistId, formData)
        } else {
          await watchlists.create(formData)
        }

        this.closeModal()
        this.fetchWatchlists()
      } catch (err) {
        console.error('Failed to save watchlist:', err)
      } finally {
        this.loading = false
      }
    },
    editWatchlist(watchlist) {
      this.form = {
        name: watchlist.name,
        description: watchlist.description,
        isPublic: watchlist.isPublic,
        coverFile: null
      }
      this.selectedWatchlistId = watchlist.id
      this.showEditModal = true
    },
    deleteWatchlist(id) {
      this.selectedWatchlistId = id
      this.showDeleteModal = true
    },
    async confirmDelete() {
      try {
        this.loading = true
        await watchlists.delete(this.selectedWatchlistId)
        this.closeModal()
        this.fetchWatchlists()
      } catch (err) {
        console.error('Failed to delete watchlist:', err)
      } finally {
        this.loading = false
      }
    },
    viewWatchlist(id) {
      this.$router.push(`/watchlists/${id}`)
    },
    closeModal() {
      this.showCreateModal = false
      this.showEditModal = false
      this.showDeleteModal = false
      this.selectedWatchlistId = null
      this.form = {
        name: '',
        description: '',
        coverFile: null,
        isPublic: true
      }
    }
  },
  mounted() {
    this.fetchWatchlists()
  }
}
</script>

<style scoped>
.watchlists-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
}

.watchlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.watchlist-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.watchlist-card:hover {
  transform: translateY(-5px);
}

.watchlist-cover {
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center;
}

.watchlist-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.watchlist-cover:hover .watchlist-overlay {
  opacity: 1;
}

.btn-view {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.btn-view:hover {
  transform: scale(1.1);
}

.watchlist-info {
  padding: 1rem;
}

.watchlist-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.watchlist-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: #3498db;
  transition: width 0.3s ease;
}

.progress-text {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.watchlist-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: #2c3e50;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #ddd;
}

.empty-state h2 {
  margin-bottom: 1rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}
</style> 