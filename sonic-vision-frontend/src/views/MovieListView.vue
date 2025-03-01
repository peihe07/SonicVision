<template>
    <div class="container">
      <h2>🎬 電影列表</h2>
      <input v-model="query" class="form-control my-3" placeholder="搜尋電影..." />
      <button @click="searchMovie" class="btn btn-primary">🔍 搜尋</button>
  
      <div class="row mt-4">
        <div class="col-md-4 mb-3" v-for="movie in movies" :key="movie.id">
          <div class="card">
            <img :src="getImageUrl(movie.poster_path)" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <p class="card-text">{{ movie.overview }}</p>
              <RouterLink :to="'/movies/' + movie.id" class="btn btn-dark">查看詳情</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const query = ref('');
  const movies = ref([]);
  
  const fetchMovies = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/movies/');
    movies.value = response.data;
  };
  
  const searchMovie = async () => {
    if (!query.value) return;
    const response = await axios.get(`http://127.0.0.1:8000/api/search-tmdb/?query=${query.value}`);
    movies.value = response.data.results;
  };
  
  const getImageUrl = (path: string) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500";
  };
  
  onMounted(fetchMovies);
  </script>
  
  <style scoped>
  .card-img-top {
    height: 300px;
    object-fit: cover;
  }
  </style>