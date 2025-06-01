import axios from 'axios';

// Spotify API 憑證
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    }
});

// 請求攔截器，添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{
        id: string;
        name: string;
        external_urls: {
            spotify: string;
        };
    }>;
    album: {
        id: string;
        name: string;
        images: Array<{
            url: string;
            height: number;
            width: number;
        }>;
    };
    preview_url: string | null;
    external_urls: {
        spotify: string;
    };
    duration_ms: number;
}

export interface SpotifySearchResponse {
    tracks: {
        items: SpotifyTrack[];
        total: number;
    };
}

export const spotifyAPI = {
    // 搜索歌曲
    searchTracks: async (query: string): Promise<SpotifyTrack[]> => {
        const response = await api.get<SpotifySearchResponse>('/api/spotify/search/', {
            params: {
                q: query,
                type: 'track'
            }
        });
        return response.data.tracks.items;
    },

    // 獲取歌曲預覽 URL
    getPreviewUrl: async (trackId: string): Promise<string> => {
        const response = await api.get<{ preview_url: string }>(`/api/spotify/preview/${trackId}/`);
        return response.data.preview_url;
    },

    // 獲取熱門音樂
    getTrendingMusic: async (): Promise<SpotifyTrack[]> => {
        try {
            const response = await api.get<SpotifyTrack[]>('/api/spotify/new-releases/');
            if (!response.data || !Array.isArray(response.data)) {
                console.error('獲取熱門音樂失敗：無效的回應格式');
                return [];
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('獲取熱門音樂時發生錯誤:', {
                    status: error.response?.status,
                    message: error.response?.data?.error || error.message
                });
            } else {
                console.error('獲取熱門音樂時發生未知錯誤:', error);
            }
            return [];
        }
    }
};

export const getSpotifyToken = async (): Promise<string> => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(
                        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
                    )}`,
                },
            }
        )
        return response.data.access_token
    } catch (error) {
        console.error('獲取 Spotify token 失敗:', error)
        // 如果沒有設置 Spotify 憑證，返回一個友好的錯誤信息
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            throw new Error('Spotify API 憑證未設置，請聯繫管理員')
        }
        throw new Error('無法獲取 Spotify 訪問令牌，請稍後再試')
    }
} 