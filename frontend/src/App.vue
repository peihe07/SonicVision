<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <header>
      <h1>Vue + Django + PostgreSQL 應用</h1>
    </header>
    <main>
      <div class="container">
        <div class="message-box">
          <h2>API 訊息</h2>
          <p>{{ message }}</p>
          <button @click="fetchMessage">獲取訊息</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      message: '點擊按鈕以從 API 獲取訊息'
    }
  },
  methods: {
    async fetchMessage() {
      try {
        const response = await axios.get('/api/hello/');
        this.message = response.data.message;
      } catch (error) {
        console.error('獲取資料時出錯:', error);
        this.message = '獲取資料時出錯';
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.message-box {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>