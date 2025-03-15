<template>
  <div class="watchlist-detail-page">
    <div class="watchlist-header" v-if="watchlist">
      <div class="watchlist-cover">
        <img :src="watchlist.coverUrl || '/default-watchlist.jpg'" :alt="watchlist.name">
      </div>
      <div class="watchlist-info">
        <h1>{{ watchlist.name }}</h1>
        <p class="watchlist-description">{{ watchlist.description }}</p>
        <div class="watchlist-meta">
          <span>{{ watchlist.movieCount }} 部電影</span>
          <span>已觀看 {{ watchlist.watchedCount }} 部</span>
          <span>{{ watchlist.owner }} 創建</span>
          <span>最後更新：{{ formatDate(watchlist.updatedAt) }}</span>
        </div>
        <div class="progress-bar" v-if="watchlist.movieCount > 0">
          <div class="progress" :style="{ width: `${(watchlist.watchedCount / watchlist.movieCount) * 100}%` }"></div>
        </div>
        <div class="watchlist-actions" v-if="canEdit">
          <button class="btn btn-primary" @click="editWatchlist">
            <i class="fas fa-edit"></i> 編輯片單
          </button>
          <button class="btn btn-danger" @click="showDeleteModal = true">
            <i class="fas fa-trash"></i> 刪除片單
          </button>
        </div>
      </div>
    </div>

    <div class="watchlist-content" v-if="watchlist">
      <div class="movies-header">
        <h2>電影列表</h2>
        <button class="btn btn-primary" @click="showAddMovieModal = true" v-if="canEdit">
          <i class="fas fa-plus"></i> 添加電影
        </button>
      </div>

      <div class="movies-list" v-if="watchlist.movies && watchlist.movies.length">
        <div v-for="movie in watchlist.movies" :key="movie.id" class="movie-item">
          <div class="movie-cover">
            <img :src="movie.posterUrl" :alt="movie.title">
          </div>
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.year }} • {{ movie.duration }}分鐘</p>
            <p class="movie-genres">{{ movie.genres.join(', ') }}</p>
          </div>
          <div class="movie-actions">
            <label class="checkbox-label" v-if="canEdit">
              <input
                type="checkbox"
                :checked="movie.watched"
                @change="toggleWatched(movie)"
              >
              <span>已觀看</span>
            </label>
            <button class="btn btn-icon" @click="viewMovieDetails(movie)">
              <i class="fas fa-info-circle"></i>
            </button>
            <button class="btn btn-icon" @click="removeMovie(movie)" v-if="canEdit">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <i class="fas fa-film"></i>
        <h3>暫無電影</h3>
        <p v-if="canEdit">點擊"添加電影"按鈕開始添加電影</p>
      </div>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 確認刪除模態框 -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-overlay" @click="showDeleteModal = false"></div>
      <div class="modal-content">
        <h2>確認刪除</h2>
        <p>確定要刪除這個片單嗎？此操作無法復原。</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deleteWatchlist" :disabled="loading">
            確認刪除
          </button>
        </div>
      </div>
    </div>

    <!-- 添加電影模態框 -->
    <div class="modal" v-if="showAddMovieModal">
      <div class="modal-overlay" @click="showAddMovieModal = false"></div>
      <div class="modal-content">
        <h2>添加電影</h2>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @input="searchMovies"
            placeholder="搜索電影..."
            class="form-control"
          >
        </div>
        <div class="search-results" v-if="searchResults.length">
          <div v-for="movie in searchResults" :key="movie.id" class="search-result-item">
            <div class="movie-cover">
              <img :src="movie.posterUrl" :alt="movie.title">
            </div>
            <div class="movie-info">
              <h3>{{ movie.title }}</h3>
              <p>{{ movie.year }} • {{ movie.duration }}分鐘</p>
            </div>
            <button class="btn btn-primary" @click="addMovie(movie)">
              添加
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showAddMovieModal = false">關閉</button>
        </div>
      </div>
    </div>

    <!-- 編輯片單模態框 -->
    <div class="modal" v-if="showEditModal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <h2>編輯片單</h2>
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
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { watchlists } from '@/services/api'
import { useAuthStore } from '@/store/modules/auth'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'WatchlistDetailPage',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const watchlist = ref(null)
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const showAddMovieModal = ref(false)
    const showEditModal = ref(false)
    const searchQuery = ref('')
    const searchResults = ref([])
    const form = ref({
      name: '',
      description: '',
      coverFile: null,
      isPublic: true
    })

    const canEdit = computed(() => {
      if (!watchlist.value || !authStore.isAuthenticated) return false
      return watchlist.value.owner === authStore.currentUser?.username
    })

    const fetchWatchlist = async () => {
      try {
        loading.value = true
        const response = await watchlists.getById(route.params.id)
        watchlist.value = response.data
      } catch (err) {
        console.error('獲取片單詳情失敗:', err)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-TW')
    }

    const handleCoverUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        form.value.coverFile = file
      }
    }

    const editWatchlist = () => {
      form.value = {
        name: watchlist.value.name,
        description: watchlist.value.description,
        coverFile: null,
        isPublic: watchlist.value.isPublic
      }
      showEditModal.value = true
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        const formData = new FormData()
        formData.append('name', form.value.name)
        formData.append('description', form.value.description)
        formData.append('isPublic', form.value.isPublic)
        if (form.value.coverFile) {
          formData.append('cover', form.value.coverFile)
        }

        await watchlists.update(watchlist.value.id, formData)
        await fetchWatchlist()
        closeModal()
      } catch (err) {
        console.error('更新片單失敗:', err)
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      showDeleteModal.value = false
      showAddMovieModal.value = false
      showEditModal.value = false
      form.value = {
        name: '',
        description: '',
        coverFile: null,
        isPublic: true
      }
      searchQuery.value = ''
      searchResults.value = []
    }

    const deleteWatchlist = async () => {
      try {
        loading.value = true
        await watchlists.delete(watchlist.value.id)
        router.push('/watchlists')
      } catch (err) {
        console.error('刪除片單失敗:', err)
      } finally {
        loading.value = false
        showDeleteModal.value = false
      }
    }

    const searchMovies = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }
      try {
        const response = await watchlists.searchMovies(searchQuery.value)
        searchResults.value = response.data
      } catch (err) {
        console.error('搜索電影失敗:', err)
      }
    }

    const addMovie = async (movie) => {
      try {
        await watchlists.addMovie(watchlist.value.id, movie.id)
        await fetchWatchlist()
      } catch (err) {
        console.error('添加電影失敗:', err)
      }
    }

    const removeMovie = async (movie) => {
      try {
        await watchlists.removeMovie(watchlist.value.id, movie.id)
        await fetchWatchlist()
      } catch (err) {
        console.error('移除電影失敗:', err)
      }
    }

    const toggleWatched = async (movie) => {
      try {
        await watchlists.toggleWatched(watchlist.value.id, movie.id)
        await fetchWatchlist()
      } catch (err) {
        console.error('更新觀看狀態失敗:', err)
      }
    }

    const viewMovieDetails = (movie) => {
      router.push(`/movie/${movie.id}`)
    }

    onMounted(() => {
      fetchWatchlist()
    })

    return {
      watchlist,
      loading,
      showDeleteModal,
      showAddMovieModal,
      showEditModal,
      searchQuery,
      searchResults,
      form,
      canEdit,
      formatDate,
      editWatchlist,
      deleteWatchlist,
      searchMovies,
      addMovie,
      removeMovie,
      toggleWatched,
      viewMovieDetails,
      handleCoverUpload,
      handleSubmit,
      closeModal
    }
  }
})
</script>

<style scoped>
.watchlist-detail-page {
  padding: 2rem;
}

.watchlist-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.watchlist-cover {
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.watchlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.watchlist-info {
  flex: 1;
}

.watchlist-info h1 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.watchlist-description {
  color: #666;
  margin-bottom: 1rem;
}

.watchlist-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress {
  height: 100%;
  background: #3498db;
  transition: width 0.3s ease;
}

.watchlist-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.movies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.movies-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.movie-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.movie-item:last-child {
  border-bottom: none;
}

.movie-cover {
  width: 100px;
  height: 150px;
  margin-right: 1rem;
  border-radius: 4px;
  overflow: hidden;
}

.movie-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-info {
  flex: 1;
}

.movie-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.movie-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.movie-genres {
  margin-top: 0.5rem !important;
  color: #3498db !important;
}

.movie-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
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

.search-box {
  margin-bottom: 1rem;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.search-result-item:last-child {
  border-bottom: none;
}
</style> 