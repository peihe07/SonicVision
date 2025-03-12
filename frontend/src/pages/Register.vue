<template>
    <div class="register">
      <h2>註冊</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="username" type="text" placeholder="帳號" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="密碼" required />
        <button type="submit">註冊</button>
      </form>
    </div>
  </template>
  
  <script>
  import { registerUser } from "../services/api";
  
  export default {
    data() {
      return {
        username: "",
        email: "",
        password: "",
      };
    },
    methods: {
      async handleRegister() {
        try {
          await registerUser({ username: this.username, email: this.email, password: this.password });
          alert("註冊成功！請登入");
          this.$router.push("/login");
        } catch (error) {
          alert("註冊失敗，請重試");
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