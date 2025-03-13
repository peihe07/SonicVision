<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>登入</h1>
      <form @submit.prevent="handleLogin" class="auth-form">
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
            placeholder="請輸入您的密碼"
          >
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember">
            <span>記住我</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            忘記密碼？
          </router-link>
        </div>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="loading">登入中...</span>
          <span v-else>登入</span>
        </button>
      </form>
      <div class="auth-divider">
        <span>或</span>
      </div>
      <div class="social-login">
        <button class="btn btn-outline btn-block" @click="handleGoogleLogin">
          <i class="fab fa-google"></i> 使用 Google 帳號登入
        </button>
      </div>
      <div class="auth-footer">
        還沒有帳號？
        <router-link to="/register">立即註冊</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin() {
      try {
        this.loading = true
        this.error = null
        
        // TODO: 實現登入邏輯
        // const response = await this.$api.auth.login(this.form)
        // localStorage.setItem('token', response.data.token)
        // this.$router.push('/discover')
        
      } catch (err) {
        this.error = '登入失敗，請檢查您的帳號密碼'
      } finally {
        this.loading = false
      }
    },
    async handleGoogleLogin() {
      try {
        // TODO: 實現 Google 登入邏輯
      } catch (err) {
        this.error = '使用 Google 登入失敗，請稍後再試'
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
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
</style>