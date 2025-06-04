import axios from 'axios'

// 設置 axios 默認配置
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://sonicvision.uno/api'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

// 添加請求攔截器
axios.interceptors.request.use(
    (config) => {
        // 從 localStorage 獲取 token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 添加響應攔截器
axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            // 服務器返回錯誤狀態碼
            console.error('Response error:', error.response.data)
        } else if (error.request) {
            // 請求已發出但沒有收到響應
            console.error('無法連接到服務器，請檢查網絡連接')
        } else {
            // 請求配置有誤
            console.error('Request error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default axios 