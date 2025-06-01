<template>
  <div class="playlist-page">
    <div class="playlist-header">
      <h1>我的播放列表</h1>
      <button class="btn btn-primary" @click="showCreateDialog = true">
        <i class="fas fa-plus"></i> 創建新播放列表
      </button>
    </div>

    <div class="playlist-grid">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card">
        <div class="playlist-cover">
          <img
            :src="playlist.cover_image || '/default-playlist-cover.jpg'"
            :alt="playlist.name"
          >
          <div class="playlist-actions">
            <button class="btn btn-icon" @click="editPlaylist(playlist)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon" @click="deletePlaylist(playlist)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="playlist-info">
          <h3>{{ playlist.name }}</h3>
          <p>{{ playlist.description || '沒有描述' }}</p>
          <div class="playlist-meta">
            <span>{{ playlist.track_count }} 首歌曲</span>
            <span>{{ playlist.is_public ? '公開' : '私人' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 創建播放列表對話框 -->
    <div v-if="showCreateDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>創建新播放列表</h2>
        <form @submit.prevent="createPlaylist">
          <div class="form-group">
            <label for="name">名稱</label>
            <input
              type="text"
              id="name"
              v-model="newPlaylist.name"
              required
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="description">描述</label>
            <textarea
              id="description"
              v-model="newPlaylist.description"
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="newPlaylist.is_public"
              >
              公開播放列表
            </label>
          </div>
          <div class="dialog-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showCreateDialog = false"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? '創建中...' : '創建' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 編輯播放列表對話框 -->
    <div v-if="showEditDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>編輯播放列表</h2>
        <form @submit.prevent="updatePlaylist">
          <div class="form-group">
            <label for="edit-name">名稱</label>
            <input
              type="text"
              id="edit-name"
              v-model="editingPlaylist.name"
              required
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="edit-description">描述</label>
            <textarea
              id="edit-description"
              v-model="editingPlaylist.description"
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="editingPlaylist.is_public"
              >
              公開播放列表
            </label>
          </div>
          <div class="dialog-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showEditDialog = false"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? '更新中...' : '更新' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { playlistAPI, type Playlist, type CreatePlaylistData } from '@/api/playlist';
import { useToast } from '@/composables/useToast';

export default defineComponent({
  name: 'PlaylistPage',
  
  setup() {
    const playlists = ref<Playlist[]>([]);
    const loading = ref(false);
    const showCreateDialog = ref(false);
    const showEditDialog = ref(false);
    const newPlaylist = ref<CreatePlaylistData>({
      name: '',
      description: '',
      is_public: true
    });
    const editingPlaylist = ref<Playlist | null>(null);
    const { showToast } = useToast();

    const loadPlaylists = async () => {
      try {
        loading.value = true;
        playlists.value = await playlistAPI.getPlaylists();
      } catch (error) {
        console.error('載入播放列表失敗:', error);
        showToast('載入播放列表失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    const createPlaylist = async () => {
      try {
        loading.value = true;
        await playlistAPI.createPlaylist(newPlaylist.value);
        showCreateDialog.value = false;
        newPlaylist.value = {
          name: '',
          description: '',
          is_public: true
        };
        await loadPlaylists();
        showToast('播放列表創建成功', 'success');
      } catch (error) {
        console.error('創建播放列表失敗:', error);
        showToast('創建播放列表失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    const editPlaylist = (playlist: Playlist) => {
      editingPlaylist.value = { ...playlist };
      showEditDialog.value = true;
    };

    const updatePlaylist = async () => {
      if (!editingPlaylist.value) return;

      try {
        loading.value = true;
        await playlistAPI.updatePlaylist(
          editingPlaylist.value.id,
          {
            name: editingPlaylist.value.name,
            description: editingPlaylist.value.description,
            is_public: editingPlaylist.value.is_public
          }
        );
        showEditDialog.value = false;
        editingPlaylist.value = null;
        await loadPlaylists();
        showToast('播放列表更新成功', 'success');
      } catch (error) {
        console.error('更新播放列表失敗:', error);
        showToast('更新播放列表失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    const deletePlaylist = async (playlist: Playlist) => {
      if (!confirm(`確定要刪除播放列表 "${playlist.name}" 嗎？`)) return;

      try {
        loading.value = true;
        await playlistAPI.deletePlaylist(playlist.id);
        await loadPlaylists();
        showToast('播放列表刪除成功', 'success');
      } catch (error) {
        console.error('刪除播放列表失敗:', error);
        showToast('刪除播放列表失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadPlaylists);

    return {
      playlists,
      loading,
      showCreateDialog,
      showEditDialog,
      newPlaylist,
      editingPlaylist,
      createPlaylist,
      editPlaylist,
      updatePlaylist,
      deletePlaylist
    };
  }
});
</script>

<style scoped>
.playlist-page {
  padding: 2rem;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.playlist-grid {
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
  transform: translateY(-4px);
}

.playlist-cover {
  position: relative;
  padding-top: 100%;
}

.playlist-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-actions {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-card:hover .playlist-actions {
  opacity: 1;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-icon:hover {
  background: white;
}

.playlist-info {
  padding: 1rem;
}

.playlist-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #2c3e50;
}

.playlist-info p {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

.dialog h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 