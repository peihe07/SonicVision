<template>
    <div class="container">
      <h2>搜尋電影</h2>
      <input v-model="query" placeholder="輸入電影名稱" />
      <button @click="searchMovie">搜尋</button>
  
      <ul v-if="movies.length">
        <li v-for="movie in movies" :key="movie.id">
          <h3>{{ movie.title }}</h3>
          <p>{{ movie.overview }}</p>
          <button @click="getMovieDetail(movie.id)">查看詳情</button>
        </li>
      </ul>
  
      <div v-if="movieDetail">
        <h2>{{ movieDetail.title }}</h2>
        <img :src="getImageUrl(movieDetail.poster_path)" alt="電影海報" />
        <p>{{ movieDetail.overview }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        query: "",
        movies: [],
        movieDetail: null
      };
    },
    methods: {
      async searchMovie() {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/search-tmdb/?query=${this.query}`);
          this.movies = response.data.results;
        } catch (error) {
          console.error("搜尋失敗:", error);
        }
      },
      async getMovieDetail(movieId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/tmdb-movie/${movieId}/`);
          this.movieDetail = response.data;
        } catch (error) {
          console.error("獲取詳情失敗:", error);
        }
      },
      getImageUrl(path) {
        return path ? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500";
      }
    }
  };
  </script>
  
  <style>
  .container {
    max-width: 600px;
    margin: auto;
    text-align: center;
  }
  input {
    padding: 8px;
    margin: 10px;
    width: 80%;
  }
  button {
    padding: 8px 12px;
    cursor: pointer;
  }
  </style>