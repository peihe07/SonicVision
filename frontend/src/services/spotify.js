import { API_CONFIG } from '@/config/api.config'
import axios from 'axios'

const { SPOTIFY } = API_CONFIG

// 創建 axios 實例
const spotifyApi = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// 請求攔截器
spotifyApi.interceptors.request.use(
    async (config) => {
        try {
            // 確保有有效的訪問令牌
            let token = localStorage.getItem('spotify_token')
            if (!token) {
                token = await getSpotifyToken()
            }
            config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
            console.error('Failed to get token:', error)
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
            try {
                // 獲取新的訪問令牌
                const token = await getSpotifyToken()
                // 更新原始請求的認證頭
                error.config.headers.Authorization = `Bearer ${token}`
                // 重試原始請求
                return spotifyApi(error.config)
            } catch (refreshError) {
                localStorage.removeItem('spotify_token')
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

// 獲取 Spotify 訪問令牌
export const getSpotifyToken = async () => {
    try {
        const credentials = `${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`;
        const base64Credentials = btoa(credentials);

        const response = await axios.post(SPOTIFY.AUTH_URL,
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${base64Credentials}`
                }
            }
        )
        const token = response.data.access_token
        localStorage.setItem('spotify_token', token)
        return token
    } catch (error) {
        console.error('Failed to get Spotify token:', error)
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

export const searchSpotify = async (query, type = 'track') => {
    try {
        const response = await spotifyApi.get('/spotify/search/', {
            params: {
                q: query,
                type,
                market: 'TW',
                limit: 20
            }
        });

        if (!response.data || !response.data.tracks || !response.data.tracks.items) {
            throw new Error('無效的響應格式');
        }

        return {
            tracks: {
                items: response.data.tracks.items,
                hasMore: response.data.tracks.next !== null
            }
        };
    } catch (error) {
        console.error('搜尋 Spotify 時發生錯誤:', error);
        if (error.response?.data?.error) {
            console.error('錯誤詳情:', error.response.data.error);
        }
        throw new Error(error.response?.data?.error?.message || '搜尋失敗，請稍後再試');
    }
};

export const getPreviewUrl = async (trackId) => {
    try {
        // 先檢查是否有預覽 URL
        const response = await spotifyApi.get(`/spotify/preview/${trackId}/`);
        const previewUrl = response.data?.preview_url;

        if (!previewUrl) {
            console.info(`歌曲 ${trackId} 無預覽版本`);
            throw new Error('無試聽版本');
        }

        return previewUrl;
    } catch (error) {
        console.error('獲取預覽 URL 時發生錯誤:', error);
        if (error.message === '無試聽版本' || error.response?.status === 404) {
            throw new Error('無試聽版本');
        }
        throw new Error(error.response?.data?.error || '獲取預覽失敗，請稍後再試');
    }
};

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