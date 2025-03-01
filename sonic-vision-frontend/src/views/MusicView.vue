<template>
  <div class="container mt-4">
    <h2 class="text-center text-primary">🎵 音樂探索</h2>

    <!-- 🔍 搜尋框 -->
    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="輸入歌手或歌曲名稱..."
        @input="searchMusic"
      />
    </div>

    <!-- 🎶 音樂列表 -->
    <div class="row">
      <div class="col-md-4" v-for="music in musicList" :key="music.id">
        <div class="card">
          <img :src="music.album?.images?.[0]?.url || 'https://via.placeholder.com/150'" 
               class="card-img-top" 
               :alt="music.name || '未知歌曲'">

          <div class="card-body">
            <h5 class="card-title">{{ music.name || '未知歌曲' }}</h5>

            <p class="card-text">
              🎤 {{
                music.artists && music.artists.length > 0
                  ? music.artists.map((artist: Artist) => artist.name).join(', ')
                  : '未知藝人'
              }}
            </p>

            <a v-if="music.external_urls?.spotify" 
               :href="music.external_urls.spotify" 
               target="_blank" 
               class="btn btn-success">🎧 在 Spotify 播放</a>

            <span v-else class="text-muted">無法播放</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定義 TypeScript 類型
interface Artist {
  name: string;
}

interface Album {
  images: { url: string }[];
}

interface ExternalUrls {
  spotify?: string;
}

interface MusicTrack {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: ExternalUrls;
}

// 狀態變數
const searchQuery = ref('');
const musicList = ref<MusicTrack[]>([]);

// 🔹 取得音樂資料（確保讀取 `tracks.items`）
const fetchMusic = async (query = 'top hits') => {
  try {
    const response = await axios.get(`/api/music/explore/?q=${query}`);
    if (response.data.tracks && response.data.tracks.items) {
      musicList.value = response.data.tracks.items;  // ✅ 只抓取 `items`
    } else {
      musicList.value = [];
    }
  } catch (error) {
    console.error('取得音樂失敗:', error);
    musicList.value = [];
  }
};

// 🔎 搜尋音樂
const searchMusic = () => {
  fetchMusic(searchQuery.value);
};

// 🔹 頁面載入時，顯示熱門歌曲
onMounted(() => {
  fetchMusic();
});
</script>