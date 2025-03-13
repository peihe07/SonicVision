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
            <span>我同意 <a href="/terms" target="_blank">服務條款</a> 和 <a href="/privacy" target="_blank">隱私政策</a></span>
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
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      },
      loading: false,
      error: null
    }
  },
  methods: {
    validateForm() {
      if (this.form.password.length < 8) {
        this.error = '密碼長度必須至少 8 位'
        return false
      }
      if (!/[A-Za-z]/.test(this.form.password) || !/[0-9]/.test(this.form.password)) {
        this.error = '密碼必須包含字母和數字'
        return false
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.error = '兩次輸入的密碼不一致'
        return false
      }
      return true
    },
    async handleRegister() {
      try {
        if (!this.validateForm()) return
        
        this.loading = true
        this.error = null
        
        // TODO: 實現註冊邏輯
        // const response = await this.$api.auth.register(this.form)
        // localStorage.setItem('token', response.data.token)
        // this.$router.push('/discover')
        
      } catch (err) {
        this.error = '註冊失敗，請稍後再試'
      } finally {
        this.loading = false
      }
    },
    async handleGoogleRegister() {
      try {
        // TODO: 實現 Google 註冊邏輯
      } catch (err) {
        this.error = '使用 Google 註冊失敗，請稍後再試'
      }
    }
  }
}
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