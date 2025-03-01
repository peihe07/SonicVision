<template>
    <div class="container">
      <button class="btn btn-secondary mb-3" @click="$router.go(-1)">⬅ 返回</button>
      <div v-if="movie">
        <h2>{{ movie.title }}</h2>
        <img :src="getImageUrl(movie.poster_path)" class="img-fluid" />
        <p>{{ movie.overview }}</p>
        <p><strong>上映日期：</strong> {{ movie.release_date }}</p>
      </div>
      <div v-else>
        <p>載入中...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const movie = ref(null);
  
  const fetchMovieDetail = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/tmdb-movie/${route.params.id}/`);
    movie.value = response.data;
  };
  
  const getImageUrl = (path: string) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500";
  };
  
  onMounted(fetchMovieDetail);
  </script>
  
  <style scoped>
  .img-fluid {
    max-width: 100%;
    height: auto;
  }
  </style>