<template>
  <div class="playlist-detail-page">
    <div class="playlist-header" v-if="playlist">
      <div class="playlist-cover">
        <img :src="playlist.coverUrl || '/default-playlist.jpg'" :alt="playlist.name">
      </div>
      <div class="playlist-info">
        <h1>{{ playlist.name }}</h1>
        <p class="playlist-description">{{ playlist.description }}</p>
        <div class="playlist-meta">
          <span>{{ playlist.songCount }} 首歌曲</span>
          <span>{{ playlist.owner }} 創建</span>
          <span>最後更新：{{ formatDate(playlist.updatedAt) }}</span>
        </div>
        <div class="playlist-actions" v-if="canEdit">
          <button class="btn btn-primary" @click="editPlaylist">
            <i class="fas fa-edit"></i> 編輯歌單
          </button>
          <button class="btn btn-danger" @click="showDeleteModal = true">
            <i class="fas fa-trash"></i> 刪除歌單
          </button>
        </div>
      </div>
    </div>

    <div class="playlist-content" v-if="playlist">
      <div class="songs-header">
        <h2>歌曲列表</h2>
        <button class="btn btn-primary" @click="showAddSongModal = true" v-if="canEdit">
          <i class="fas fa-plus"></i> 添加歌曲
        </button>
      </div>

      <div class="songs-list" v-if="playlist.songs && playlist.songs.length">
        <div v-for="(song, index) in playlist.songs" :key="song.id" class="song-item">
          <div class="song-index">{{ index + 1 }}</div>
          <div class="song-cover">
            <img :src="song.coverUrl" :alt="song.name">
          </div>
          <div class="song-info">
            <h3>{{ song.name }}</h3>
            <p>{{ song.artist }}</p>
          </div>
          <div class="song-duration">{{ formatDuration(song.duration) }}</div>
          <div class="song-actions">
            <button class="btn btn-icon" @click="playSong(song)">
              <i class="fas fa-play"></i>
            </button>
            <button class="btn btn-icon" @click="removeSong(song)" v-if="canEdit">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <i class="fas fa-music"></i>
        <h3>暫無歌曲</h3>
        <p v-if="canEdit">點擊"添加歌曲"按鈕開始添加音樂</p>
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
        <p>確定要刪除這個歌單嗎？此操作無法復原。</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deletePlaylist" :disabled="loading">
            確認刪除
          </button>
        </div>
      </div>
    </div>

    <!-- 添加歌曲模態框 -->
    <div class="modal" v-if="showAddSongModal">
      <div class="modal-overlay" @click="showAddSongModal = false"></div>
      <div class="modal-content">
        <h2>添加歌曲</h2>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @input="searchSongs"
            placeholder="搜索歌曲..."
            class="form-control"
          >
        </div>
        <div class="search-results" v-if="searchResults.length">
          <div v-for="song in searchResults" :key="song.id" class="search-result-item">
            <div class="song-cover">
              <img :src="song.coverUrl" :alt="song.name">
            </div>
            <div class="song-info">
              <h3>{{ song.name }}</h3>
              <p>{{ song.artist }}</p>
            </div>
            <button class="btn btn-primary" @click="addSong(song)">
              添加
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showAddSongModal = false">關閉</button>
        </div>
      </div>
    </div>

    <!-- 編輯歌單模態框 -->
    <div class="modal" v-if="showEditModal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <h2>編輯歌單</h2>
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
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { playlists } from '@/services/api'
import { useAuthStore } from '@/store/modules/auth'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PlaylistDetailPage',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const playlist = ref(null)
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const showAddSongModal = ref(false)
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
      if (!playlist.value || !authStore.isAuthenticated) return false
      return playlist.value.owner === authStore.currentUser?.username
    })

    const fetchPlaylist = async () => {
      try {
        loading.value = true
        const response = await playlists.getById(route.params.id)
        playlist.value = response.data
      } catch (err) {
        console.error('獲取歌單詳情失敗:', err)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-TW')
    }

    const formatDuration = (duration) => {
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handleCoverUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        form.value.coverFile = file
      }
    }

    const editPlaylist = () => {
      form.value = {
        name: playlist.value.name,
        description: playlist.value.description,
        coverFile: null,
        isPublic: playlist.value.isPublic
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

        await playlists.update(playlist.value.id, formData)
        await fetchPlaylist()
        closeModal()
      } catch (err) {
        console.error('更新歌單失敗:', err)
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      showDeleteModal.value = false
      showAddSongModal.value = false
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

    const deletePlaylist = async () => {
      try {
        loading.value = true
        await playlists.delete(playlist.value.id)
        router.push('/playlists')
      } catch (err) {
        console.error('刪除歌單失敗:', err)
      } finally {
        loading.value = false
        showDeleteModal.value = false
      }
    }

    const searchSongs = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }
      try {
        const response = await playlists.searchSongs(searchQuery.value)
        searchResults.value = response.data
      } catch (err) {
        console.error('搜索歌曲失敗:', err)
      }
    }

    const addSong = async (song) => {
      try {
        await playlists.addSong(playlist.value.id, song.id)
        await fetchPlaylist()
      } catch (err) {
        console.error('添加歌曲失敗:', err)
      }
    }

    const removeSong = async (song) => {
      try {
        await playlists.removeSong(playlist.value.id, song.id)
        await fetchPlaylist()
      } catch (err) {
        console.error('移除歌曲失敗:', err)
      }
    }

    const playSong = (song) => {
      // TODO: 實現播放功能
      console.log('播放歌曲:', song)
    }

    onMounted(() => {
      fetchPlaylist()
    })

    return {
      playlist,
      loading,
      showDeleteModal,
      showAddSongModal,
      showEditModal,
      searchQuery,
      searchResults,
      form,
      canEdit,
      formatDate,
      formatDuration,
      editPlaylist,
      deletePlaylist,
      searchSongs,
      addSong,
      removeSong,
      playSong,
      handleCoverUpload,
      handleSubmit,
      closeModal
    }
  }
})
</script>

<style scoped>
.playlist-detail-page {
  padding: 2rem;
}

.playlist-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.playlist-cover {
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-info {
  flex: 1;
}

.playlist-info h1 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.playlist-description {
  color: #666;
  margin-bottom: 1rem;
}

.playlist-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.playlist-actions {
  display: flex;
  gap: 1rem;
}

.songs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.songs-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.song-item:last-child {
  border-bottom: none;
}

.song-index {
  width: 40px;
  text-align: center;
  color: #666;
}

.song-cover {
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  border-radius: 4px;
  overflow: hidden;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  flex: 1;
}

.song-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.song-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.song-duration {
  color: #666;
  margin: 0 1rem;
}

.song-actions {
  display: flex;
  gap: 0.5rem;
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