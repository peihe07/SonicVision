<template>
  <div class="playlist-detail-page">
    <div v-if="loading" class="loading">
      載入中...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="playlist" class="playlist-content">
      <div class="playlist-header">
        <div class="playlist-cover">
          <img :src="playlist.cover_image || '/default-playlist-cover.jpg'" :alt="playlist.name">
          <div v-if="canEdit" class="cover-upload">
            <label for="cover-upload" class="btn btn-icon">
              <i class="fas fa-camera"></i>
            </label>
            <input type="file" id="cover-upload" accept="image/*" @change="uploadCover" style="display: none">
          </div>
        </div>
        <div class="playlist-info">
          <h1>{{ playlist.name }}</h1>
          <p class="description">{{ playlist.description || '沒有描述' }}</p>
          <div class="meta">
            <span>{{ playlist.track_count }} 首歌曲</span>
            <span>{{ playlist.is_public ? '公開' : '私人' }}</span>
            <span>由 {{ playlist.owner.username }} 創建</span>
          </div>
          <div class="actions" v-if="canEdit">
            <button class="btn btn-primary" @click="showEditDialog = true">
              <i class="fas fa-edit"></i> 編輯
            </button>
            <button class="btn btn-secondary" @click="showCollaboratorsDialog = true">
              <i class="fas fa-users"></i> 管理協作者
            </button>
            <button class="btn btn-secondary" @click="generateShareLink">
              <i class="fas fa-share-alt"></i> 分享
            </button>
          </div>
        </div>
      </div>

      <div class="tracks-section">
        <div class="section-header">
          <h2>歌曲列表</h2>
          <button v-if="canEdit" class="btn btn-primary" @click="showAddTrackDialog = true">
            <i class="fas fa-plus"></i> 添加歌曲
          </button>
        </div>

        <div class="tracks-list">
          <div v-for="(track, index) in playlist.tracks" :key="track.id" class="track-item"
            :class="{ 'dragging': draggedTrack === track }" draggable="true" @dragstart="startDrag($event, track)"
            @dragend="endDrag" @dragover.prevent @drop="drop($event, index)">
            <div class="track-number">{{ index + 1 }}</div>
            <div class="track-info">
              <div class="track-name">{{ track.track_id }}</div>
              <div class="track-artist">由 {{ track.added_by.username }} 添加</div>
            </div>
            <div class="track-actions" v-if="canEdit">
              <button class="btn btn-icon" @click="removeTrack(track)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯播放列表對話框 -->
    <div v-if="showEditDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>編輯播放列表</h2>
        <form @submit.prevent="updatePlaylist">
          <div class="form-group">
            <label for="edit-name">名稱</label>
            <input type="text" id="edit-name" v-model="editingPlaylist.name" required class="form-control">
          </div>
          <div class="form-group">
            <label for="edit-description">描述</label>
            <textarea id="edit-description" v-model="editingPlaylist.description" class="form-control"
              rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="editingPlaylist.is_public">
              公開播放列表
            </label>
          </div>
          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" @click="showEditDialog = false">
              取消
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '更新中...' : '更新' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 添加歌曲對話框 -->
    <div v-if="showAddTrackDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>添加歌曲</h2>
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜索歌曲..." class="form-control" @input="searchTracks">
        </div>
        <div class="search-results" v-if="searchResults.length > 0">
          <div v-for="track in searchResults" :key="track.id" class="track-item" @click="addTrack(track)">
            <div class="track-info">
              <div class="track-name">{{ track.name }}</div>
              <div class="track-artist">{{track.artists.map(a => a.name).join(', ')}}</div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" @click="showAddTrackDialog = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 管理協作者對話框 -->
    <div v-if="showCollaboratorsDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>管理協作者</h2>
        <div class="collaborators-list">
          <div v-for="collaborator in playlist.collaborators" :key="collaborator.id" class="collaborator-item">
            <div class="collaborator-info">
              <div class="collaborator-name">{{ collaborator.user.username }}</div>
              <div class="collaborator-role">
                {{ collaborator.can_edit ? '可編輯' : '僅查看' }}
              </div>
            </div>
            <div class="collaborator-actions">
              <button class="btn btn-icon" @click="removeCollaborator(collaborator.user.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="add-collaborator">
          <input type="text" v-model="newCollaboratorEmail" placeholder="輸入用戶郵箱..." class="form-control">
          <button class="btn btn-primary" @click="addCollaborator" :disabled="!newCollaboratorEmail">
            添加
          </button>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" @click="showCollaboratorsDialog = false">
            關閉
          </button>
        </div>
      </div>
    </div>

    <!-- 分享對話框 -->
    <div v-if="showShareDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>分享播放列表</h2>
        <div class="share-content">
          <div class="share-url">
            <input type="text" :value="shareUrl" readonly class="form-control">
            <button class="btn btn-primary" @click="copyShareLink">
              <i class="fas fa-copy"></i> 複製
            </button>
          </div>
          <p class="share-note">
            分享代碼：{{ shareCode }}
          </p>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" @click="showShareDialog = false">
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { playlistAPI, type Playlist, type PlaylistTrack, type PlaylistCollaborator } from '@/api/playlist';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/store/modules/auth';
import { spotifyAPI, type SpotifyTrack } from '@/api/spotify';
import { userAPI, type User } from '@/api/user';

export default defineComponent({
  name: 'PlaylistDetailPage',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const { showToast } = useToast();

    const playlist = ref<Playlist | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const showEditDialog = ref(false);
    const showAddTrackDialog = ref(false);
    const showCollaboratorsDialog = ref(false);
    const showShareDialog = ref(false);
    const searchQuery = ref('');
    const searchResults = ref<SpotifyTrack[]>([]);
    const newCollaboratorEmail = ref('');
    const draggedTrack = ref<PlaylistTrack | null>(null);
    const shareUrl = ref('');
    const shareCode = ref('');

    const canEdit = computed(() => {
      if (!playlist.value) return false;
      return (
        playlist.value.owner.id === authStore.currentUser?.id ||
        playlist.value.collaborators.some(
          c => c.user.id === authStore.currentUser?.id && c.can_edit
        )
      );
    });

    const loadPlaylist = async () => {
      try {
        loading.value = true;
        error.value = null;
        const id = parseInt(route.params.id as string);
        playlist.value = await playlistAPI.getPlaylist(id);
      } catch (err) {
        console.error('載入播放列表失敗:', err);
        error.value = '載入播放列表失敗';
        showToast('載入播放列表失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    const updatePlaylist = async () => {
      if (!playlist.value) return;

      try {
        loading.value = true;
        await playlistAPI.updatePlaylist(
          playlist.value.id,
          {
            name: playlist.value.name,
            description: playlist.value.description,
            is_public: playlist.value.is_public
          }
        );
        showEditDialog.value = false;
        await loadPlaylist();
        showToast('播放列表更新成功', 'success');
      } catch (err) {
        console.error('更新播放列表失敗:', err);
        showToast('更新播放列表失敗', 'error');
      } finally {
        loading.value = false;
      }
    };

    const searchTracks = async () => {
      if (!searchQuery.value) {
        searchResults.value = [];
        return;
      }

      try {
        searchResults.value = await spotifyAPI.searchTracks(searchQuery.value);
      } catch (err) {
        console.error('搜索歌曲失敗:', err);
        showToast('搜索歌曲失敗', 'error');
      }
    };

    const addTrack = async (track: SpotifyTrack) => {
      if (!playlist.value) return;

      try {
        await playlistAPI.addTrack(playlist.value.id, track.id);
        showAddTrackDialog.value = false;
        await loadPlaylist();
        showToast('歌曲添加成功', 'success');
      } catch (err) {
        console.error('添加歌曲失敗:', err);
        showToast('添加歌曲失敗', 'error');
      }
    };

    const removeTrack = async (track: PlaylistTrack) => {
      if (!playlist.value) return;

      if (!confirm('確定要移除這首歌曲嗎？')) return;

      try {
        await playlistAPI.removeTrack(playlist.value.id, track.track_id);
        await loadPlaylist();
        showToast('歌曲移除成功', 'success');
      } catch (err) {
        console.error('移除歌曲失敗:', err);
        showToast('移除歌曲失敗', 'error');
      }
    };

    const addCollaborator = async () => {
      if (!playlist.value || !newCollaboratorEmail.value) return;

      try {
        const user = await userAPI.findByEmail(newCollaboratorEmail.value);
        await playlistAPI.addCollaborator(playlist.value.id, user.id);
        newCollaboratorEmail.value = '';
        await loadPlaylist();
        showToast('協作者添加成功', 'success');
      } catch (err) {
        console.error('添加協作者失敗:', err);
        showToast('添加協作者失敗', 'error');
      }
    };

    const removeCollaborator = async (userId: number) => {
      if (!playlist.value) return;

      try {
        await playlistAPI.removeCollaborator(playlist.value.id, userId);
        await loadPlaylist();
        showToast('協作者移除成功', 'success');
      } catch (err) {
        console.error('移除協作者失敗:', err);
        showToast('移除協作者失敗', 'error');
      }
    };

    const startDrag = (event: DragEvent, track: PlaylistTrack) => {
      draggedTrack.value = track;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
      }
    };

    const endDrag = () => {
      draggedTrack.value = null;
    };

    const drop = async (event: DragEvent, index: number) => {
      if (!playlist.value || !draggedTrack.value) return;

      const tracks = [...playlist.value.tracks];
      const draggedIndex = tracks.findIndex(t => t.id === draggedTrack.value?.id);

      if (draggedIndex === -1) return;

      // 重新排序
      const [removed] = tracks.splice(draggedIndex, 1);
      tracks.splice(index, 0, removed);

      try {
        await playlistAPI.reorderTracks(
          playlist.value.id,
          tracks.map(t => t.track_id)
        );
        await loadPlaylist();
      } catch (err) {
        console.error('重新排序失敗:', err);
        showToast('重新排序失敗', 'error');
      }
    };

    const uploadCover = async (event: Event) => {
      if (!playlist.value) return;

      const input = event.target as HTMLInputElement;
      if (!input.files || !input.files[0]) return;

      const file = input.files[0];

      // 驗證文件類型
      if (!file.type.startsWith('image/')) {
        showToast('請上傳圖片文件', 'error');
        return;
      }

      try {
        await playlistAPI.uploadCover(playlist.value.id, file);
        await loadPlaylist();
        showToast('封面圖片上傳成功', 'success');
      } catch (err) {
        console.error('上傳封面圖片失敗:', err);
        showToast('上傳封面圖片失敗', 'error');
      }
    };

    const generateShareLink = async () => {
      if (!playlist.value) return;

      try {
        const { share_code, share_url } = await playlistAPI.generateShareLink(playlist.value.id);
        shareCode.value = share_code;
        shareUrl.value = share_url;
        showShareDialog.value = true;
      } catch (err) {
        console.error('生成分享連結失敗:', err);
        showToast('生成分享連結失敗', 'error');
      }
    };

    const copyShareLink = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl.value);
        showToast('分享連結已複製到剪貼簿', 'success');
      } catch (err) {
        console.error('複製分享連結失敗:', err);
        showToast('複製分享連結失敗', 'error');
      }
    };

    onMounted(loadPlaylist);

    return {
      playlist,
      loading,
      error,
      showEditDialog,
      showAddTrackDialog,
      showCollaboratorsDialog,
      showShareDialog,
      searchQuery,
      searchResults,
      newCollaboratorEmail,
      draggedTrack,
      canEdit,
      updatePlaylist,
      searchTracks,
      addTrack,
      removeTrack,
      addCollaborator,
      removeCollaborator,
      startDrag,
      endDrag,
      drop,
      uploadCover,
      shareUrl,
      shareCode,
      generateShareLink,
      copyShareLink,
    };
  }
});
</script>

<style scoped>
.playlist-detail-page {
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.playlist-content {
  max-width: 1200px;
  margin: 0 auto;
}

.playlist-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.playlist-cover {
  position: relative;
  width: 300px;
  height: 300px;
  flex-shrink: 0;
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.playlist-info {
  flex: 1;
}

.playlist-info h1 {
  margin: 0 0 1rem;
  font-size: 2.5rem;
  color: #2c3e50;
}

.description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.meta {
  display: flex;
  gap: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.tracks-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.track-item:hover {
  background: #e9ecef;
}

.track-item.dragging {
  opacity: 0.5;
}

.track-number {
  width: 40px;
  text-align: center;
  color: #666;
}

.track-info {
  flex: 1;
  margin: 0 1rem;
}

.track-name {
  font-weight: 500;
  color: #2c3e50;
}

.track-artist {
  font-size: 0.9rem;
  color: #666;
}

.track-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.track-item:hover .track-actions {
  opacity: 1;
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
  max-height: 90vh;
  overflow-y: auto;
}

.dialog h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
}

.search-box {
  margin-bottom: 1rem;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.collaborators-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.collaborator-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.collaborator-info {
  flex: 1;
}

.collaborator-name {
  font-weight: 500;
  color: #2c3e50;
}

.collaborator-role {
  font-size: 0.9rem;
  color: #666;
}

.add-collaborator {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cover-upload {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-cover:hover .cover-upload {
  opacity: 1;
}

.cover-upload .btn-icon {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 40px;
  height: 40px;
}

.cover-upload .btn-icon:hover {
  background: rgba(0, 0, 0, 0.9);
}

.share-content {
  margin-bottom: 1.5rem;
}

.share-url {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.share-url .form-control {
  flex: 1;
}

.share-note {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
}
</style>