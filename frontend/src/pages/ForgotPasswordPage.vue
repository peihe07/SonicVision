<template>
  <div class="forgot-password-page">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-4">
            <v-card-title class="text-center text-h5 mb-4">
              重設密碼
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4">
                請輸入您的電子郵件地址，我們將發送重設密碼的連結給您。
              </p>
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="email"
                  label="電子郵件"
                  type="email"
                  required
                  :rules="[v => !!v || '請輸入電子郵件', v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件']"
                />
                <v-alert
                  v-if="error"
                  type="error"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>
                <v-alert
                  v-if="message"
                  type="success"
                  class="mb-4"
                >
                  {{ message }}
                </v-alert>
                <v-btn
                  block
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
                >
                  發送重設連結
                </v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                variant="text"
                to="/login"
              >
                返回登入
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { authAPI } from '@/services/api';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ForgotPasswordPage',
  setup() {
    const email = ref('');
    const message = ref('');
    const error = ref('');
    const loading = ref(false);

    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        message.value = '';

        await authAPI.forgotPassword(email.value);
        message.value = '重置密碼鏈接已發送到您的郵箱';
      } catch (err) {
        error.value = '發送重置密碼郵件失敗';
        message.value = '';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      message,
      error,
      loading,
      handleSubmit
    };
  }
});
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  padding: 2rem 0;
  background-color: #f5f5f5;
}
</style> 