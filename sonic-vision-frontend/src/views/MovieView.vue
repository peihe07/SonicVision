<template>
  <div class="container mt-4">
    <h2 class="text-center text-danger">🎬 電影探索</h2>
    <div class="row">
      <div class="col-md-4" v-for="movie in movieList" :key="movie.id">
        <div class="card">
          <img :src="movie.image" class="card-img-top" :alt="movie.title">
          <div class="card-body">
            <h5 class="card-title">{{ movie.title }}</h5>
            <p class="card-text">{{ movie.director }}</p>
            <button class="btn btn-outline-danger">觀看預告片</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const movieList = ref([
  { id: 1, title: "Movie A", director: "Director 1", image: "https://via.placeholder.com/200" },
  { id: 2, title: "Movie B", director: "Director 2", image: "https://via.placeholder.com/200" },
  { id: 3, title: "Movie C", director: "Director 3", image: "https://via.placeholder.com/200" }
]);
</script>