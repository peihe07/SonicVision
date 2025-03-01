<template>
    <div class="p-4 max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-4">註冊帳號</h1>
      
      <input v-model="username" placeholder="帳號" class="border p-2 w-full mb-2" />
      <input v-model="email" placeholder="電子郵件" class="border p-2 w-full mb-2" />
      <input v-model="password" type="password" placeholder="密碼" class="border p-2 w-full mb-2" />
      
      <button @click="register" class="bg-blue-500 text-white px-4 py-2 rounded w-full">註冊</button>
      
      <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { registerUser } from "../api.js";
  
  export default {
    data() {
      return {
        username: "",
        email: "",
        password: "",
        message: "",
        error: ""
      };
    },
    methods: {
      async register() {
        try {
          this.message = "";
          this.error = "";
          await registerUser({
            username: this.username,
            email: this.email,
            password: this.password
          });
          this.message = "註冊成功！請登入";
        } catch (err) {
          this.error = "註冊失敗，請檢查輸入資料";
        }
      }
    }
  };
  </script>