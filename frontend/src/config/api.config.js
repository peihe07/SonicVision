export const API_CONFIG = {
    // Spotify API 配置
    SPOTIFY: {
        BASE_URL: 'https://api.spotify.com/v1',
        AUTH_URL: 'https://accounts.spotify.com/api/token',
        CLIENT_ID: process.env.VUE_APP_SPOTIFY_CLIENT_ID,
        CLIENT_SECRET: process.env.VUE_APP_SPOTIFY_CLIENT_SECRET,
        REDIRECT_URI: process.env.VUE_APP_SPOTIFY_REDIRECT_URI,
        SCOPES: [
            'user-read-private',
            'user-read-email',
            'streaming',
            'user-library-read',
            'user-library-modify'
        ].join(' ')
    },

    // TMDB API 配置
    TMDB: {
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
        API_KEY: process.env.VUE_APP_TMDB_API_KEY,
        ACCESS_TOKEN: process.env.VUE_APP_TMDB_ACCESS_TOKEN,
        LANGUAGE: 'en-US',
        REGION: 'US'
    }
} 