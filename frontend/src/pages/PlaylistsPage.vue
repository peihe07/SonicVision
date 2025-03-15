<template>
  <div class="playlists-page">
    <div class="page-header">
      <h1>推薦歌單</h1>
      <button class="btn btn-primary" @click="showCreateModal = true" v-if="isAuthenticated">
        <i class="fas fa-plus"></i> 創建新歌單
      </button>
    </div>

    <div class="playlists-grid" v-if="!loading && playlists.length">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card">
        <div class="playlist-cover" :style="{ backgroundImage: `url(${playlist.coverUrl || '/default-playlist.jpg'})` }">
          <div class="playlist-overlay">
            <button class="btn btn-play" @click="playPlaylist(playlist.id)">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
        <div class="playlist-info">
          <h3>{{ playlist.name }}</h3>
          <p class="playlist-meta">{{ playlist.songCount }} 首歌曲 • {{ formatDate(playlist.updatedAt) }}</p>
          <div class="playlist-actions" v-if="isAuthenticated && playlist.canEdit">
            <button class="btn btn-icon" @click="editPlaylist(playlist)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon" @click="deletePlaylist(playlist.id)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else-if="!loading && !playlists.length">
      <i class="fas fa-music"></i>
      <h2>暫無推薦歌單</h2>
      <p v-if="isAuthenticated">創建一個歌單，開始收藏喜愛的音樂吧！</p>
      <button class="btn btn-primary" @click="showCreateModal = true" v-if="isAuthenticated">
        創建歌單
      </button>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 創建/編輯歌單模態框 -->
    <div class="modal" v-if="showCreateModal || showEditModal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <h2>{{ showEditModal ? '編輯歌單' : '創建新歌單' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="playlistName">歌單名稱</label>
            <input
              type="text"
              id="playlistName"
              v-model="form.name"
              required
              class="form-control"
              placeholder="為您的歌單取個名字"
            >
          </div>
          <div class="form-group">
            <label for="playlistDescription">描述</label>
            <textarea
              id="playlistDescription"
              v-model="form.description"
              class="form-control"
              rows="3"
              placeholder="描述一下這個歌單..."
            ></textarea>
          </div>
          <div class="form-group">
            <label for="playlistCover">封面圖片</label>
            <input
              type="file"
              id="playlistCover"
              @change="handleCoverUpload"
              accept="image/*"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.isPublic">
              <span>公開歌單</span>
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
        <p>確定要刪除這個歌單嗎？此操作無法復原。</p>
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
import { playlists } from '@/services/api'
import { useAuthStore } from '@/store/modules/auth'
import { computed, defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PlaylistsPage',
  
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const state = {
      playlists: [],
      loading: false,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedPlaylistId: null,
      form: {
        name: '',
        description: '',
        coverFile: null,
        isPublic: true
      }
    }

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const currentUser = computed(() => authStore.currentUser?.username)

    const fetchPlaylists = async () => {
      try {
        state.loading = true
        const response = await playlists.getAll()
        state.playlists = response.data.map(playlist => ({
          ...playlist,
          canEdit: isAuthenticated.value && playlist.owner === currentUser.value
        }))
      } catch (err) {
        console.error('獲取歌單失敗:', err)
      } finally {
        state.loading = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-TW')
    }

    const handleCoverUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        state.form.coverFile = file
      }
    }

    const handleSubmit = async () => {
      try {
        state.loading = true
        const formData = new FormData()
        formData.append('name', state.form.name)
        formData.append('description', state.form.description)
        formData.append('isPublic', state.form.isPublic)
        if (state.form.coverFile) {
          formData.append('cover', state.form.coverFile)
        }

        if (state.showEditModal) {
          await playlists.update(state.selectedPlaylistId, formData)
        } else {
          await playlists.create(formData)
        }

        closeModal()
        fetchPlaylists()
      } catch (err) {
        console.error('Failed to save playlist:', err)
      } finally {
        state.loading = false
      }
    }

    const editPlaylist = (playlist) => {
      state.form = {
        name: playlist.name,
        description: playlist.description,
        isPublic: playlist.isPublic,
        coverFile: null
      }
      state.selectedPlaylistId = playlist.id
      state.showEditModal = true
    }

    const deletePlaylist = (id) => {
      state.selectedPlaylistId = id
      state.showDeleteModal = true
    }

    const confirmDelete = async () => {
      try {
        state.loading = true
        await playlists.delete(state.selectedPlaylistId)
        closeModal()
        fetchPlaylists()
      } catch (err) {
        console.error('Failed to delete playlist:', err)
      } finally {
        state.loading = false
      }
    }

    const closeModal = () => {
      state.showCreateModal = false
      state.showEditModal = false
      state.showDeleteModal = false
      state.selectedPlaylistId = null
      state.form = {
        name: '',
        description: '',
        coverFile: null,
        isPublic: true
      }
    }

    const playPlaylist = (id) => {
      router.push(`/playlist/${id}`)
    }

    onMounted(() => {
      fetchPlaylists()
    })

    return {
      ...state,
      isAuthenticated,
      currentUser,
      fetchPlaylists,
      formatDate,
      handleCoverUpload,
      handleSubmit,
      editPlaylist,
      deletePlaylist,
      confirmDelete,
      closeModal,
      playPlaylist
    }
  }
})
</script>

<style scoped>
.playlists-page {
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

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.playlist-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.playlist-card:hover {
  transform: translateY(-5px);
}

.playlist-cover {
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center;
}

.playlist-overlay {
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

.playlist-cover:hover .playlist-overlay {
  opacity: 1;
}

.btn-play {
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

.btn-play:hover {
  transform: scale(1.1);
}

.playlist-info {
  padding: 1rem;
}

.playlist-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.playlist-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.playlist-actions {
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