<template>
  <div class="not-found-page">
    <v-container class="text-center">
      <v-row justify="center" align="center" style="min-height: 80vh;">
        <v-col cols="12">
          <v-img
            src="/images/404.svg"
            max-width="400"
            class="mx-auto mb-8"
            alt="404 圖片"
          ></v-img>
          
          <h1 class="text-h2 mb-6">找不到頁面</h1>
          <p class="text-h6 grey--text mb-8">
            抱歉，您要找的頁面似乎不存在或已被移除。
          </p>

          <v-btn
            color="primary"
            x-large
            rounded
            to="/"
          >
            <v-icon left>mdi-home</v-icon>
            返回首頁
          </v-btn>

          <v-btn
            class="ml-4"
            text
            x-large
            rounded
            @click="$router.go(-1)"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            返回上一頁
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFoundPage',
});
</script>

<style scoped>
.not-found-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>