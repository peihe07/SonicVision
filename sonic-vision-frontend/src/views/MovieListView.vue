<template>
  <div class="container">
    <h2>🎬 電影列表</h2>
    
    <!-- 🔍 搜尋輸入框 -->
    <input v-model="query" class="form-control my-3" placeholder="搜尋電影..." />
    
    <!-- 🔍 搜尋按鈕 -->
    <button @click="searchMovie" class="btn btn-primary">🔍 搜尋</button>

    <!-- 電影列表 -->
    <div class="row mt-4">
      <div class="col-md-4 mb-3" v-for="movie in movies" :key="movie.id || movie.movie_id">
        <div class="card">
          <img :src="getImageUrl(movie.poster_path)" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">{{ movie.title }}</h5>
            <p class="card-text">{{ movie.overview || "沒有簡介" }}</p>
            <RouterLink :to="'/movies/' + (movie.id || movie.movie_id)" class="btn btn-dark">查看詳情</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import axios from "axios";

const query = ref('');
const movies = ref([]);

const API_BASE_URL = "http://127.0.0.1:8000/api";

const searchMovie = async () => {
  console.log("🔍 searchMovie() 被執行！");  // ✅ 確保函數有執行
  if (!query.value) {
    console.warn("⚠️ 請輸入搜尋關鍵字！");
    return;
  }

  try {
    console.log(`📡 發送請求至 /api/search-tmdb/?query=${query.value}`);
    const response = await axios.get(`http://127.0.0.1:8000/api/search-tmdb/?query=${query.value}`);
    console.log("✅ TMDB 回應:", response.data); // ✅ 確保有接收到數據
    movies.value = response.data.results;
  } catch (error) {
    console.error("❌ 搜尋失敗:", error);
  }
};

// 監聽 movies 變數，確保數據有更新
watchEffect(() => {
  if (!movies.value) {
    console.warn("⚠️ movies.value 是 null，可能 API 沒有回應數據！");
  } else {
    console.log("🎬 更新 movies:", movies.value);
  }
});
</script>