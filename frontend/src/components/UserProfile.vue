<template>
    <div class="user-profile">
      <h2>用戶資訊</h2>
      <div v-if="user">
        <p><strong>用戶名：</strong> {{ user.username }}</p>
        <p><strong>電子郵件：</strong> {{ user.email }}</p>
      </div>
      <div v-else-if="loading">載入中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import api from "@/services/api";
  
  export default {
    data() {
      return {
        user: null,
        loading: true,
        error: null
      };
    },
    mounted() {
      this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const response = await api.get("/profile");
          this.user = response.data;
        } catch (err) {
          this.error = "無法獲取用戶資訊，請確認是否已登入。";
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    margin: auto;
  }
  .error {
    color: red;
  }
  </style>
  