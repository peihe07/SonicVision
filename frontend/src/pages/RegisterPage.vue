<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>註冊帳號</h1>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">用戶名稱</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            class="form-control"
            placeholder="請輸入您的用戶名稱"
          >
        </div>
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            class="form-control"
            placeholder="請輸入您的電子郵件"
          >
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            class="form-control"
            placeholder="請設定您的密碼"
          >
          <small class="form-text">密碼長度至少 8 位，需包含字母和數字</small>
        </div>
        <div class="form-group">
          <label for="confirmPassword">確認密碼</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            class="form-control"
            placeholder="請再次輸入密碼"
          >
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="form.agreeToTerms"
              required
            >
            <span>我同意 <a href="#" @click.prevent="showTerms">服務條款</a> 和 <a href="#" @click.prevent="showPrivacy">隱私政策</a></span>
          </label>
        </div>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading || !form.agreeToTerms">
          <span v-if="loading">註冊中...</span>
          <span v-else>註冊</span>
        </button>
      </form>
      <div class="auth-divider">
        <span>或</span>
      </div>
      <div class="social-login">
        <button class="btn btn-outline btn-block" @click="handleGoogleRegister">
          <i class="fab fa-google"></i> 使用 Google 帳號註冊
        </button>
      </div>
      <div class="auth-footer">
        已經有帳號？
        <router-link to="/login">立即登入</router-link>
      </div>
    </div>

    <!-- 服務條款對話框 -->
    <PolicyDialog
      v-model="termsDialog"
      title="服務條款"
      :content="termsContent"
    />

    <!-- 隱私政策對話框 -->
    <PolicyDialog
      v-model="privacyDialog"
      title="隱私政策"
      :content="privacyContent"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import PolicyDialog from '../components/PolicyDialog.vue';
import { useAuthStore } from '../store/modules/auth';

export default defineComponent({
  name: 'RegisterPage',
  components: {
    PolicyDialog
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const form = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    
    const loading = ref(false);
    const error = ref(null);
    const termsDialog = ref(false);
    const privacyDialog = ref(false);

    // 服務條款內容
    const termsContent = [
      {
        title: '1. 接受條款',
        text: '歡迎使用 SonicVision。通過訪問或使用我們的服務，您同意受這些條款的約束。如果您不同意這些條款，請不要使用我們的服務。'
      },
      {
        title: '2. 服務說明',
        text: 'SonicVision 提供音樂和電影相關的服務，包括但不限於：',
        items: [
          '音樂和電影資訊瀏覽',
          '個人收藏管理',
          '社群互動功能',
          '個人化推薦',
          '評論和評分系統',
          '播放列表創建和管理'
        ]
      },
      {
        title: '3. 用戶責任',
        text: '作為用戶，您同意：',
        items: [
          '提供準確的個人資料',
          '保護您的帳戶安全',
          '遵守所有適用的法律法規',
          '尊重其他用戶的權利',
          '不發布違法或不當內容',
          '不濫用或干擾服務正常運作'
        ]
      },
      {
        title: '4. 智慧財產權',
        text: '所有內容，包括但不限於文字、圖像、音樂、視頻等，均受智慧財產權法保護。未經授權，不得複製、修改或分發。'
      },
      {
        title: '5. 免責聲明',
        text: '我們不保證服務的連續性、無錯誤或無病毒。我們不對因使用或無法使用服務而造成的任何損失負責。'
      },
      {
        title: '6. 條款修改',
        text: '我們保留隨時修改這些條款的權利。修改後的條款將在網站上發布，並在發布時生效。'
      },
      {
        title: '7. 終止',
        text: '我們保留因違反這些條款而終止或暫停您使用服務的權利。'
      },
      {
        title: '8. 適用法律',
        text: '這些條款受中華民國法律管轄，任何爭議應提交中華民國法院解決。'
      }
    ];

    // 隱私政策內容
    const privacyContent = [
      {
        title: '1. 資料收集',
        text: '我們收集的資料包括：',
        items: [
          '個人資料（姓名、電子郵件等）',
          '使用數據（瀏覽歷史、搜尋記錄等）',
          '設備信息（瀏覽器類型、操作系統等）',
          '位置信息（IP地址、地理位置等）',
          '社群互動數據（評論、評分等）',
          '偏好設置和個人化數據'
        ]
      },
      {
        title: '2. 資料使用',
        text: '我們使用收集的資料：',
        items: [
          '提供和改進服務',
          '個人化用戶體驗',
          '發送服務通知',
          '防止欺詐和濫用',
          '進行數據分析和統計',
          '提供客戶支持'
        ]
      },
      {
        title: '3. 資料共享',
        text: '我們不會出售您的個人資料。我們只在以下情況下共享資料：',
        items: [
          '經您同意',
          '法律要求',
          '保護我們的權利和財產',
          '與服務提供商合作',
          '進行必要的系統維護'
        ]
      },
      {
        title: '4. 資料安全',
        text: '我們採取適當的技術和組織措施來保護您的資料，包括：',
        items: [
          '加密傳輸和存儲',
          '定期安全評估',
          '訪問控制',
          '員工培訓',
          '安全漏洞監控',
          '資料備份'
        ]
      },
      {
        title: '5. Cookie 使用',
        text: '我們使用 Cookie 和類似技術來：',
        items: [
          '記住您的偏好設置',
          '分析網站使用情況',
          '提供個性化內容',
          '改善用戶體驗',
          '維護登入狀態',
          '追蹤廣告效果'
        ]
      },
      {
        title: '6. 您的權利',
        text: '您對您的個人資料擁有以下權利：',
        items: [
          '訪問和查看資料',
          '更正不準確的資料',
          '刪除資料',
          '限制資料處理',
          '資料可攜性',
          '撤回同意'
        ]
      },
      {
        title: '7. 政策更新',
        text: '我們可能會不時更新本隱私政策。更新後的政策將在網站上發布，並在發布時生效。'
      },
      {
        title: '8. 聯絡我們',
        text: '如果您對本隱私政策有任何疑問，請通過以下方式聯絡我們：',
        items: [
          '電子郵件：privacy@sonicvision.com',
          '電話：(02) 1234-5678',
          '地址：台北市信義區信義路五段7號'
        ]
      }
    ];

    const showTerms = () => {
      termsDialog.value = true;
    };

    const showPrivacy = () => {
      privacyDialog.value = true;
    };

    const validateForm = () => {
      if (form.value.password.length < 8) {
        error.value = '密碼長度必須至少 8 位';
        return false;
      }
      if (!/[A-Za-z]/.test(form.value.password) || !/[0-9]/.test(form.value.password)) {
        error.value = '密碼必須包含字母和數字';
        return false;
      }
      if (form.value.password !== form.value.confirmPassword) {
        error.value = '兩次輸入的密碼不一致';
        return false;
      }
      return true;
    };

    const handleRegister = async () => {
      try {
        if (!validateForm()) return;
        
        loading.value = true;
        error.value = null;
        
        await authStore.register(form.value.username, form.value.email, form.value.password);
        
        // 註冊成功後，等待一下再跳轉
        setTimeout(() => {
          router.push('/discover');
        }, 1000);
        
      } catch (err) {
        console.error('Registration error:', err);
        if (err.response) {
          // 後端返回的錯誤信息
          const errorMessage = err.response.data.message || '註冊失敗，請稍後再試';
          error.value = errorMessage;
        } else if (err.request) {
          // 請求已發出但沒有收到響應
          error.value = '無法連接到服務器，請檢查網絡連接';
        } else {
          // 請求配置有誤
          error.value = '註冊請求配置錯誤，請稍後再試';
        }
      } finally {
        loading.value = false;
      }
    };

    const handleGoogleRegister = async () => {
      try {
        // TODO: 實現 Google 註冊邏輯
        error.value = 'Google 註冊功能尚未實現';
      } catch (err) {
        error.value = '使用 Google 註冊失敗，請稍後再試';
        console.error('Google registration error:', err);
      }
    };

    return {
      form,
      loading,
      error,
      termsDialog,
      privacyDialog,
      termsContent,
      privacyContent,
      showTerms,
      showPrivacy,
      handleRegister,
      handleGoogleRegister
    };
  }
});
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  margin: -2rem;
  padding: 2rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
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
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  margin-top: 0.25rem;
}

.checkbox-label a {
  color: #3498db;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
}

.auth-divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #ddd;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background: white;
  padding: 0 1rem;
  color: #666;
}

.social-login {
  margin-bottom: 1.5rem;
}

.social-login .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-footer {
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  margin-left: 0.5rem;
}

.auth-footer a:hover {
  text-decoration: underline;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>