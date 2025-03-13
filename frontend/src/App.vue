<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="brand">SonicVision</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/discover" class="nav-link">探索</router-link>
        <router-link to="/playlists" class="nav-link">我的歌單</router-link>
        <router-link to="/watchlists" class="nav-link">我的片單</router-link>
        <router-link to="/community" class="nav-link">社群</router-link>
        <router-link to="/about" class="nav-link">關於</router-link>
      </div>
      <div class="nav-auth">
        <router-link to="/login" class="nav-link">登入</router-link>
        <router-link to="/register" class="btn btn-primary">註冊</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>SonicVision</h3>
          <p>您的音樂與電影探索平台</p>
        </div>
        <div class="footer-section">
          <h3>快速連結</h3>
          <router-link to="/discover" class="footer-link">探索</router-link>
          <router-link to="/playlists" class="footer-link">歌單</router-link>
          <router-link to="/watchlists" class="footer-link">片單</router-link>
        </div>
        <div class="footer-section">
          <h3>聯絡我們</h3>
          <p>contact@sonicvision.com</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 SonicVision. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Microsoft JhengHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand .brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-auth {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
}

.footer-link {
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>