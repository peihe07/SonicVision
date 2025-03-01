<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <img src="https://via.placeholder.com/300" class="card-img-top" alt="Music Cover">
          <div class="card-body">
            <h5 class="card-title">🎵 音樂探索</h5>
            <p class="card-text">發掘新的獨立音樂，找到你的最愛！</p>
            <RouterLink to="/music" class="btn btn-primary">探索音樂</RouterLink>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <img src="https://via.placeholder.com/300" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">🎬 電影探索</h5>
            <p class="card-text">觀看獨立電影，體驗不同的故事！</p>
            <RouterLink to="/movies" class="btn btn-primary">探索電影</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="registerModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">註冊帳號</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="email" class="form-control mb-2" placeholder="輸入 Email">
          <input type="password" class="form-control" placeholder="輸入密碼">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary">註冊</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>