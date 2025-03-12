<template>
    <div class="login">
      <h2>登入</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="username" type="text" placeholder="帳號" required />
        <input v-model="password" type="password" placeholder="密碼" required />
        <button type="submit">登入</button>
      </form>
    </div>
  </template>
  
  <script>
  import { loginUser } from "../services/api";
  
  export default {
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await loginUser({ username: this.username, password: this.password });
          localStorage.setItem("token", response.data.access); // 儲存 JWT Token
          alert("登入成功！");
          this.$router.push("/");
        } catch (error) {
          alert("登入失敗，請檢查帳號密碼");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  input {
    display: block;
    margin: 10px 0;
    padding: 8px;
    width: 200px;
  }
  button {
    padding: 8px 12px;
    background-color: #42b983;
    color: white;
    border: none;
  }
  </style>