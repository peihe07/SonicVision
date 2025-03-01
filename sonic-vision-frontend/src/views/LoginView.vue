<template>
  <div class="container">
    <h2>登入</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="使用者名稱" required class="form-control mb-2" />
      <input v-model="password" type="password" placeholder="密碼" required class="form-control mb-2" />
      <button type="submit" class="btn btn-success">登入</button>
    </form>
    <p>還沒有帳號？<RouterLink to="/register">註冊</RouterLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login/", {
      username: username.value,
      password: password.value
    });
    localStorage.setItem("userToken", response.data.token);
    alert("登入成功！");
    router.push("/movies");
  } catch (error) {
    alert("登入失敗：" + error.response.data.error);
  }
};
</script>