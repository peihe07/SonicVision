import axios from 'axios';

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

const SPOTIFY_CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;

const getSpotifyToken = async () => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('獲取 Spotify token 失敗:', error);
        throw error;
    }
};

const spotifyClient = axios.create({
    baseURL: '/api/spotify',
    headers: {
        'Content-Type': 'application/json'
    }
});

spotifyClient.interceptors.request.use(async (config) => {
    const token = await getSpotifyToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function searchSpotify(query: string, page = 1): Promise<SpotifyResponse> {
    try {
        if (!query.trim()) {
            return {
                items: [],
                hasMore: false
            };
        }

        const limit = 20;
        const offset = Math.max(0, (page - 1) * limit);

        const response = await spotifyClient.get<SpotifySearchResponse>('/search', {
            params: {
                q: query.trim(),
                type: 'track',
                limit,
                offset,
                market: 'TW'
            }
        });

        const tracks = response.data.tracks.items;
        const hasMore = tracks.length === limit;

        return {
            items: tracks,
            hasMore
        };
    } catch (error) {
        console.error('Spotify 搜索錯誤:', error);
        throw new Error('無法搜索 Spotify 音樂');
    }
}

export async function getTrendingMusic(): Promise<SpotifyTrack[]> {
    try {
        const response = await spotifyClient.get<SpotifyNewReleasesResponse>('/browse/new-releases', {
            params: {
                limit: 20,
                country: 'US'
            }
        });

        return response.data.albums.items.map(album => ({
            id: album.id,
            name: album.name,
            artists: album.artists,
            album: {
                id: album.id,
                name: album.name,
                images: album.images,
                artists: album.artists,
                external_urls: album.external_urls
            },
            preview_url: null,
            external_urls: album.external_urls
        }));
    } catch (error) {
        console.error('Error fetching trending music:', error);
        throw new Error('Failed to fetch trending music');
    }
} 