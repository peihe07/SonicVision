<template>
  <div class="settings-page">
    <h1>設定</h1>

    <div class="settings-section">
      <h2>帳號安全</h2>
      <form @submit.prevent="handlePasswordChange" class="settings-form">
        <div class="form-group">
          <label>目前密碼</label>
          <input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            class="form-control"
            placeholder="請輸入目前密碼"
          >
        </div>
        <div class="form-group">
          <label>新密碼</label>
          <input 
            v-model="passwordForm.newPassword" 
            type="password" 
            class="form-control"
            placeholder="請輸入新密碼"
          >
        </div>
        <div class="form-group">
          <label>確認新密碼</label>
          <input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            class="form-control"
            placeholder="請再次輸入新密碼"
          >
        </div>
        <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
          {{ passwordLoading ? '更新中...' : '更新密碼' }}
        </button>
      </form>
    </div>

    <div class="settings-section">
      <h2>通知設定</h2>
      <div class="settings-options">
        <div class="setting-item">
          <div class="setting-info">
            <h3>電子郵件通知</h3>
            <p>接收重要更新和活動的電子郵件通知</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="notificationSettings.email_notifications"
              @change="handleNotificationChange"
            >
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <h3>新追蹤者通知</h3>
            <p>當有新用戶追蹤您時接收通知</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="notificationSettings.push_notifications"
              @change="handleNotificationChange"
            >
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <h3>貼文互動通知</h3>
            <p>當您的貼文收到讚或評論時接收通知</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="notificationSettings.postInteraction"
              @change="handleNotificationChange"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>隱私設定</h2>
      <div class="settings-options">
        <div class="setting-item">
          <div class="setting-info">
            <h3>公開個人資料</h3>
            <p>允許其他用戶查看您的個人資料</p>
          </div>
          <select 
            v-model="privacySettings.profile_visibility"
            @change="handlePrivacyChange"
            class="form-select"
          >
            <option value="public">公開</option>
            <option value="private">私密</option>
          </select>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <h3>顯示活動狀態</h3>
            <p>向其他用戶顯示您的在線狀態</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="privacySettings.show_activity"
              @change="handlePrivacyChange"
            >
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <h3>搜尋可見度</h3>
            <p>允許其他用戶通過搜尋找到您</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="privacySettings.searchable"
              @change="handlePrivacyChange"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="settings-section danger-zone">
      <h2>危險區域</h2>
      <div class="danger-actions">
        <div class="danger-item">
          <div class="danger-info">
            <h3>停用帳號</h3>
            <p>暫時停用您的帳號，您可以隨時重新啟用</p>
          </div>
          <button class="btn btn-warning" @click="handleDeactivateAccount">
            停用帳號
          </button>
        </div>
        <div class="danger-item">
          <div class="danger-info">
            <h3>刪除帳號</h3>
            <p>永久刪除您的帳號和所有相關資料，此操作無法復原</p>
          </div>
          <button class="btn btn-danger" @click="handleDeleteAccount">
            刪除帳號
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import type { NotificationSettings, PasswordUpdateData, PrivacySettings } from '@/types/api';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SettingsPage',

  setup() {
    const authStore = useAuthStore();
    const passwordLoading = ref(false);

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const notificationSettings = ref<NotificationSettings>({
      email_notifications: true,
      push_notifications: true,
      postInteraction: true
    });

    const privacySettings = ref<PrivacySettings>({
      profile_visibility: 'public' as const,
      show_activity: true,
      searchable: true
    });

    const handlePasswordChange = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        // TODO: 顯示錯誤訊息
        return;
      }

      try {
        passwordLoading.value = true;
        const passwordData: PasswordUpdateData = {
          current_password: passwordForm.value.currentPassword,
          new_password: passwordForm.value.newPassword,
          confirm_password: passwordForm.value.confirmPassword
        };
        await authStore.updatePassword(passwordData);
        // TODO: 顯示成功訊息
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch (error) {
        console.error('更新密碼失敗:', error);
      } finally {
        passwordLoading.value = false;
      }
    };

    const handleNotificationChange = async () => {
      try {
        await authStore.updateNotificationSettings(notificationSettings.value);
        // TODO: 顯示成功訊息
      } catch (error) {
        console.error('更新通知設定失敗:', error);
      }
    };

    const handlePrivacyChange = async () => {
      try {
        await authStore.updatePrivacySettings(privacySettings.value);
        // TODO: 顯示成功訊息
      } catch (error) {
        console.error('更新隱私設定失敗:', error);
      }
    };

    const handleDeactivateAccount = async () => {
      if (!confirm('確定要停用帳號嗎？')) return;
      
      try {
        await authStore.deactivateAccount();
        // TODO: 導向登入頁面
      } catch (error) {
        console.error('停用帳號失敗:', error);
      }
    };

    const handleDeleteAccount = async () => {
      if (!confirm('確定要永久刪除帳號嗎？此操作無法復原！')) return;
      
      try {
        await authStore.deleteAccount();
        // TODO: 導向首頁
      } catch (error) {
        console.error('刪除帳號失敗:', error);
      }
    };

    return {
      passwordForm,
      passwordLoading,
      notificationSettings,
      privacySettings,
      handlePasswordChange,
      handleNotificationChange,
      handlePrivacyChange,
      handleDeactivateAccount,
      handleDeleteAccount
    };
  }
});
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-page h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #42b983;
  outline: none;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.setting-info h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.setting-info p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #42b983;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.danger-zone {
  border: 1px solid #fee2e2;
}

.danger-zone h2 {
  color: #ef4444;
}

.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
}

.danger-info h3 {
  margin: 0;
  color: #ef4444;
  font-size: 1.1rem;
}

.danger-info p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover {
  background: #3aa876;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-select {
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 100px;
}

.form-select:focus {
  border-color: #42b983;
  outline: none;
}
</style> 