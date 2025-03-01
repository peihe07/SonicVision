<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem("userToken");
};

const logout = () => {
  localStorage.removeItem("userToken");
  isAuthenticated.value = false;
  router.push("/");
};

onMounted(checkAuth);
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
            <li class="nav-item"><RouterLink class="nav-link" to="/register">📝 註冊</RouterLink></li>
            <li v-if="!isAuthenticated" class="nav-item"><RouterLink class="nav-link" to="/login">🔑 登入</RouterLink></li>
            <li v-if="isAuthenticated" class="nav-item"><button @click="logout" class="btn btn-danger">🚪 登出</button></li>
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

.navbar-nav .nav-link {
  transition: color 0.3s ease-in-out;
  padding: 8px 12px;
}

.navbar-nav .nav-link:hover {
  text-decoration: underline;
  color: #f8d210 !important;
}

.navbar-nav .router-link-active {
  text-decoration: underline;
  color: #f8d210 !important;
  font-weight: bold;
}

</style>