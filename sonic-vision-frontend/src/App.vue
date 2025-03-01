<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <!-- 🔹 Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">
          <img alt="Sonic Vision Logo" src="@/assets/logo.svg" width="50" height="50" />
          Sonic Vision
        </RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><RouterLink class="nav-link" to="/">🏠 首頁</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/music">🎵 音樂</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/movies">🎬 電影</RouterLink></li>
            <li class="nav-item"><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#registerModal">📝 註冊</button></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="container mt-4">
    <RouterView />
  </main>
</template>

<style scoped>
.logo {
  margin-right: 10px;
}

.navbar-nav .nav-link:hover {
  text-decoration: underline;
  color: #f8d210 !important; /* 變成黃色 */
}
</style>