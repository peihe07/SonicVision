<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        重設密碼
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        請輸入您的電子郵件地址，我們將發送重設密碼的連結給您
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              電子郵件
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? '處理中...' : '發送重設連結' }}
            </button>
          </div>

          <div v-if="message" :class="['mt-4 text-sm text-center', messageClass]">
            {{ message }}
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                或者
              </span>
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <router-link
              to="/login"
              class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              返回登入
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authAPI } from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const isLoading = ref(false);
const message = ref('');
const messageClass = ref('');

const handleSubmit = async () => {
  if (!email.value) return;

  isLoading.value = true;
  message.value = '';

  try {
    await authAPI.forgotPassword(email.value);
    message.value = '重設密碼連結已發送到您的電子郵件';
    messageClass.value = 'text-green-600';
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error) {
    message.value = '發送重設連結失敗，請稍後再試';
    messageClass.value = 'text-red-600';
  } finally {
    isLoading.value = false;
  }
};
</script> 