<template>
    <div>
      <h1>個人資訊頁面</h1>
      <UserProfile :username="user.username" />
    </div>
  </template>
  
  <script>
  import UserProfile from "@/components/UserProfile.vue";
  
  export default {
    components: { UserProfile },
    data() {
      return {
        user: { username: "Alice" }
      };
    }
  };
  </script>