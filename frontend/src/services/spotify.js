import { API_CONFIG } from '@/config/api.config'
import axios from 'axios'

const { SPOTIFY } = API_CONFIG

// 創建 axios 實例
const spotifyApi = axios.create({
    baseURL: SPOTIFY.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 請求攔截器
spotifyApi.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('spotify_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 響應攔截器
spotifyApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token 過期，嘗試刷新
            try {
                await refreshToken()
                // 重試原始請求
                return spotifyApi(error.config)
            } catch (refreshError) {
                localStorage.removeItem('spotify_token')
                localStorage.removeItem('spotify_refresh_token')
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

// 獲取 Spotify 訪問令牌
export const getSpotifyToken = async () => {
    try {
        const response = await axios.post(SPOTIFY.AUTH_URL,
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`).toString('base64')}`
                }
            }
        )
        localStorage.setItem('spotify_token', response.data.access_token)
        return response.data.access_token
    } catch (error) {
        console.error('Failed to get Spotify token:', error)
        throw error
    }
}

// 刷新 Spotify 令牌
const refreshToken = async () => {
    const refreshToken = localStorage.getItem('spotify_refresh_token')
    if (!refreshToken) {
        throw new Error('No refresh token available')
    }

    try {
        const response = await axios.post(SPOTIFY.AUTH_URL,
            `grant_type=refresh_token&refresh_token=${refreshToken}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`).toString('base64')}`
                }
            }
        )
        localStorage.setItem('spotify_token', response.data.access_token)
        return response.data.access_token
    } catch (error) {
        console.error('Failed to refresh Spotify token:', error)
        throw error
    }
}

// 搜索音樂
export const searchMusic = async (query, type = 'track', limit = 20) => {
    try {
        const response = await spotifyApi.get('/search', {
            params: {
                q: query,
                type,
                limit,
                market: 'TW'
            }
        })
        return response.data
    } catch (error) {
        console.error('Failed to search music:', error)
        throw error
    }
}

// 獲取音樂詳情
export const getMusicDetails = async (trackId) => {
    try {
        const response = await spotifyApi.get(`/tracks/${trackId}`)
        return response.data
    } catch (error) {
        console.error('Failed to get music details:', error)
        throw error
    }
}

// 獲取藝術家詳情
export const getArtistDetails = async (artistId) => {
    try {
        const response = await spotifyApi.get(`/artists/${artistId}`)
        return response.data
    } catch (error) {
        console.error('Failed to get artist details:', error)
        throw error
    }
}

// 獲取藝術家熱門歌曲
export const getArtistTopTracks = async (artistId) => {
    try {
        const response = await spotifyApi.get(`/artists/${artistId}/top-tracks`, {
            params: { market: 'TW' }
        })
        return response.data
    } catch (error) {
        console.error('Failed to get artist top tracks:', error)
        throw error
    }
}

// 獲取相關藝術家
export const getRelatedArtists = async (artistId) => {
    try {
        const response = await spotifyApi.get(`/artists/${artistId}/related-artists`)
        return response.data
    } catch (error) {
        console.error('Failed to get related artists:', error)
        throw error
    }
}

// 獲取音樂推薦
export const getMusicRecommendations = async (params) => {
    try {
        const response = await spotifyApi.get('/recommendations', { params })
        return response.data
    } catch (error) {
        console.error('Failed to get music recommendations:', error)
        throw error
    }
}

// 獲取專輯詳情
export const getAlbumDetails = async (albumId) => {
    try {
        const response = await spotifyApi.get(`/albums/${albumId}`)
        return response.data
    } catch (error) {
        console.error('Failed to get album details:', error)
        throw error
    }
}

// 獲取專輯曲目
export const getAlbumTracks = async (albumId) => {
    try {
        const response = await spotifyApi.get(`/albums/${albumId}/tracks`)
        return response.data
    } catch (error) {
        console.error('Failed to get album tracks:', error)
        throw error
    }
}

export default {
    searchMusic,
    getMusicDetails,
    getArtistDetails,
    getArtistTopTracks,
    getRelatedArtists,
    getMusicRecommendations,
    getAlbumDetails,
    getAlbumTracks
} 