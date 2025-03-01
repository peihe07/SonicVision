<template>
  <div class="container">
    <h2>🎬 電影列表</h2>
    
    <!-- 🔍 搜尋輸入框 -->
    <input v-model="query" class="form-control my-3" placeholder="搜尋電影..." />

    <!-- 🔍 搜尋按鈕 -->
    <button @click="searchMovie" class="btn btn-primary" :disabled="loading">
      <span v-if="loading">⏳ 搜尋中...</span>
      <span v-else>🔍 搜尋</span>
    </button>

    <!-- 加載中 -->
    <div v-if="loading" class="text-center mt-3">
      <p>⏳ 請稍候，正在搜尋電影...</p>
    </div>

    <!-- 搜尋結果 -->
    <div v-if="!loading">
      <!-- 🚨 搜尋錯誤 -->
      <div v-if="error" class="alert alert-danger mt-3">
        ❌ {{ error }}
      </div>

      <!-- 🎬 電影列表 -->
      <div class="row mt-4" v-if="movies.length > 0">
        <div class="col-md-4 mb-3" v-for="movie in movies" :key="movie.id || movie.movie_id">
          <div class="card">
            <img :src="getImageUrl(movie.poster_path)" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <p class="card-text">{{ movie.overview || "沒有簡介" }}</p>
              <RouterLink :to="`/movie/${movie.id || movie.movie_id}`" class="btn btn-dark">查看詳情</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 🛑 沒有找到結果 -->
      <div v-else class="alert alert-warning mt-3">
        ⚠️ 沒有找到符合條件的電影，請嘗試其他關鍵字。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const query = ref('');
const movies = ref([]);
const loading = ref(false);
const error = ref("");

const API_BASE_URL = "http://127.0.0.1:8000/api";

const searchMovie = async () => {
  if (!query.value.trim()) {
    console.warn("⚠️ 請輸入搜尋關鍵字！");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    console.log(`📡 發送請求至 ${API_BASE_URL}/search-tmdb/?query=${query.value}`);
    const response = await axios.get(`${API_BASE_URL}/search-tmdb/?query=${query.value}`);
    console.log("✅ TMDB 回應:", response.data);

    if (!response.data.results || !Array.isArray(response.data.results)) {
      console.warn("⚠️ API 回應異常，未包含 results 陣列！");
      movies.value = [];
      return;
    }

    movies.value = response.data.results;
  } catch (err) {
    console.error("❌ 搜尋失敗:", err);
    error.value = "無法獲取電影資訊，請稍後再試。";
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (path: string) => {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500";
};
</script>

<style scoped>
.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>