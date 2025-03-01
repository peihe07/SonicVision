<template>
  <div class="container">
    <h2>註冊</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="使用者名稱" required class="form-control mb-2" />
      <input v-model="password" type="password" placeholder="密碼" required class="form-control mb-2" />
      <button type="submit" class="btn btn-primary">註冊</button>
    </form>
    <p>已經有帳號？<RouterLink to="/login">登入</RouterLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

const register = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/api/register/", {
      username: username.value,
      password: password.value
    });
    alert("註冊成功，請登入！");
    router.push("/login");
  } catch (error) {
    alert("註冊失敗：" + error.response.data.error);
  }
};
</script>