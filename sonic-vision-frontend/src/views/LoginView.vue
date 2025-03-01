<template>
    <div class="p-4 max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-4">登入帳號</h1>
      
      <input v-model="username" placeholder="帳號" class="border p-2 w-full mb-2" />
      <input v-model="password" type="password" placeholder="密碼" class="border p-2 w-full mb-2" />
      
      <button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded w-full">登入</button>
      
      <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { loginUser } from "../api.js";
  
  export default {
    data() {
      return {
        username: "",
        password: "",
        message: "",
        error: ""
      };
    },
    methods: {
      async login() {
        try {
          this.message = "";
          this.error = "";
          const response = await loginUser({
            username: this.username,
            password: this.password
          });
  
          // 儲存 JWT Token
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
  
          this.message = "登入成功！";
        } catch (err) {
          this.error = "登入失敗，請檢查帳號與密碼";
        }
      }
    }
  };
  </script>