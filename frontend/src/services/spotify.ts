import type { ApiResponse, Music } from '@/types';
import axios, { AxiosError } from 'axios';

interface SpotifyArtist {
    name: string;
}

interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

interface SpotifyAlbum {
    id: string;
    name: string;
    images: SpotifyImage[];
    artists: SpotifyArtist[];
    external_urls: {
        spotify: string;
    };
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    preview_url: string | null;
    external_urls: {
        spotify: string;
    };
}

interface SpotifySearchResponse {
    tracks: {
        items: SpotifyTrack[];
    };
}

interface SpotifyNewReleasesResponse {
    albums: {
        items: SpotifyAlbum[];
    };
}

export interface SpotifyResponse {
    items: SpotifyTrack[];
    hasMore: boolean;
}

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// 用於存儲訪問令牌和過期時間
let accessToken: string | null = null;
let tokenExpiration: number | null = null;

const getSpotifyToken = async () => {
    try {
        // 檢查現有令牌是否仍然有效
        if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
            return accessToken;
        }

        const response = await axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
                }
            }
        );

        accessToken = response.data.access_token;
        // 設置令牌過期時間（通常是1小時）
        tokenExpiration = Date.now() + (response.data.expires_in * 1000);
        return accessToken;
    } catch (error) {
        console.error('獲取 Spotify token 失敗:', error);
        throw new Error('無法獲取 Spotify 訪問令牌');
    }
};

const spotifyClient = axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

spotifyClient.interceptors.request.use(async (config) => {
    const token = await getSpotifyToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function searchSpotify(query: string, page = 1): Promise<SpotifyResponse> {
    try {
        // 驗證輸入參數
        if (!query || typeof query !== 'string') {
            console.warn('搜索查詢無效:', query);
            return {
                items: [],
                hasMore: false
            };
        }

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            return {
                items: [],
                hasMore: false
            };
        }

        // 確保 page 是有效的數字
        const validPage = Number.isInteger(page) && page > 0 ? page : 1;
        const limit = 20;
        const offset = (validPage - 1) * limit;

        console.log(`執行搜索: 查詢="${trimmedQuery}", 頁碼=${validPage}, offset=${offset}`);

        const response = await spotifyClient.get<SpotifySearchResponse>('/search', {
            params: {
                q: trimmedQuery,
                type: 'track',
                limit: limit.toString(),
                offset: offset.toString(),
                market: 'TW'
            }
        });

        if (!response.data?.tracks?.items) {
            console.warn('Spotify API 返回的數據格式不正確:', response.data);
            return {
                items: [],
                hasMore: false
            };
        }

        const tracks = response.data.tracks.items;
        const hasMore = tracks.length === limit;

        return {
            items: tracks,
            hasMore
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Spotify 搜索錯誤:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                query,
                page
            });
        } else {
            console.error('未知錯誤:', error);
        }

        // 返回空結果而不是拋出錯誤
        return {
            items: [],
            hasMore: false
        };
    }
}

// 模擬數據
const mockTrendingMusic: Music[] = [
    {
        id: 1,
        title: '模擬音樂 1',
        artist: '模擬藝術家 1',
        coverUrl: 'https://via.placeholder.com/300',
        rating: 4.5,
        previewUrl: 'https://example.com/preview1.mp3',
        spotifyUrl: 'https://open.spotify.com/track/example1',
        youtubeUrl: 'https://www.youtube.com/watch?v=example1'
    },
    {
        id: 2,
        title: '模擬音樂 2',
        artist: '模擬藝術家 2',
        coverUrl: 'https://via.placeholder.com/300',
        rating: 4.3,
        previewUrl: 'https://example.com/preview2.mp3',
        spotifyUrl: 'https://open.spotify.com/track/example2',
        youtubeUrl: 'https://www.youtube.com/watch?v=example2'
    }
];

export const getTrendingMusic = async (): Promise<ApiResponse<Music[]>> => {
    try {
        // 先嘗試從 Spotify API 獲取數據
        const response = await spotifyClient.get<SpotifyNewReleasesResponse>('/browse/new-releases', {
            params: {
                limit: 20,
                country: 'TW'
            }
        });

        if (!response.data?.albums?.items) {
            throw new Error('Spotify API 返回的數據格式不正確');
        }

        // 轉換數據格式
        const musicData: Music[] = response.data.albums.items.map(album => ({
            id: parseInt(album.id),
            title: album.name,
            artist: album.artists.map(artist => artist.name).join(', '),
            coverUrl: album.images[0]?.url || 'https://via.placeholder.com/300',
            rating: 0,
            previewUrl: undefined,
            spotifyUrl: album.external_urls.spotify,
            youtubeUrl: undefined
        }));

        return {
            data: musicData,
            message: '成功獲取熱門音樂'
        };
    } catch (error) {
        console.warn('Spotify API 請求失敗，使用模擬數據:', error);
        return {
            data: mockTrendingMusic,
            message: '使用模擬數據'
        };
    }
}; 