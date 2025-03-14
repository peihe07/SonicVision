import { API_CONFIG } from '@/config/api.config';
import axios from 'axios';

const { TMDB } = API_CONFIG

// 創建 axios 實例
const tmdbApi = axios.create({
    baseURL: TMDB.BASE_URL,
    params: {
        api_key: TMDB.API_KEY,
        language: TMDB.LANGUAGE,
        region: TMDB.REGION
    }
})

// 添加請求攔截器
tmdbApi.interceptors.request.use(config => {
    // 確保每個請求都包含語言設置
    config.params = {
        ...config.params,
        language: TMDB.LANGUAGE,
        region: TMDB.REGION
    };

    // 調試信息
    console.log('TMDB API 請求配置:', {
        url: config.url,
        method: config.method,
        params: config.params
    });

    return config;
});

// 添加響應攔截器
tmdbApi.interceptors.response.use(
    response => {
        // 調試信息
        console.log('TMDB API 響應成功:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        if (error.response) {
            const { status, statusText, data } = error.response;
            console.error('TMDB API 錯誤:', {
                status,
                statusText,
                data,
                url: error.config.url,
                method: error.config.method,
                params: error.config.params
            });
        } else if (error.request) {
            console.error('TMDB API 請求錯誤:', error.request);
        } else {
            console.error('TMDB API 錯誤:', error.message);
        }
        return Promise.reject(error);
    }
);

// 獲取圖片完整 URL
export const getImageUrl = (path, size = 'original') => {
    if (!path) return null
    return `${TMDB.IMAGE_BASE_URL}/${size}${path}`
}

// 搜索電影
export const searchMovies = async (query, page = 1) => {
    try {
        const response = await tmdbApi.get('/search/movie', {
            params: {
                query,
                page,
                include_adult: false
            }
        })
        return response.data
    } catch (error) {
        console.error('搜索電影失敗:', error)
        throw error
    }
}

// 獲取電影詳情
export const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'credits,videos,recommendations,similar'
            }
        })
        return response.data
    } catch (error) {
        console.error('獲取電影詳情失敗:', error)
        throw error
    }
}

// 獲取電影演員陣容
export const getMovieCredits = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/credits`)
        return response.data
    } catch (error) {
        console.error('獲取電影演員陣容失敗:', error)
        throw error
    }
}

// 獲取電影視頻
export const getMovieVideos = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/videos`)
        return response.data
    } catch (error) {
        console.error('獲取電影視頻失敗:', error)
        throw error
    }
}

// 獲取電影評論
export const getMovieReviews = async (movieId, page = 1) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/reviews`, {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取電影評論失敗:', error)
        throw error
    }
}

// 獲取正在上映的電影
export const getNowPlayingMovies = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/movie/now_playing', {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取正在上映電影失敗:', error)
        throw error
    }
}

// 獲取即將上映的電影
export const getUpcomingMovies = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/movie/upcoming', {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取即將上映電影失敗:', error)
        throw error
    }
}

// 獲取熱門電影
export const getPopularMovies = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/movie/popular', {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取熱門電影失敗:', error)
        throw error
    }
}

// 獲取評分最高的電影
export const getTopRatedMovies = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/movie/top_rated', {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取評分最高電影失敗:', error)
        throw error
    }
}

// 獲取電影推薦
export const getMovieRecommendations = async (movieId, page = 1) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取電影推薦失敗:', error)
        throw error
    }
}

// 獲取相似電影
export const getSimilarMovies = async (movieId, page = 1) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
            params: { page }
        })
        return response.data
    } catch (error) {
        console.error('獲取相似電影失敗:', error)
        throw error
    }
}

// 獲取電影類型列表
export const getMovieGenres = async () => {
    try {
        const response = await tmdbApi.get('/genre/movie/list');
        const genres = response.data.genres.map(genre => ({
            ...genre,
            name_en: genre.name // 保持與之前相同的結構，但使用英文名稱
        }));
        return { genres };
    } catch (error) {
        console.error('Failed to fetch movie genres:', error);
        throw error;
    }
}

// 根據類型獲取電影
export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const response = await tmdbApi.get('/discover/movie', {
            params: {
                with_genres: genreId,
                page
            }
        })
        return response.data
    } catch (error) {
        console.error('根據類型獲取電影失敗:', error)
        throw error
    }
}

export default {
    getImageUrl,
    searchMovies,
    getMovieDetails,
    getMovieCredits,
    getMovieVideos,
    getMovieReviews,
    getNowPlayingMovies,
    getUpcomingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getMovieRecommendations,
    getSimilarMovies,
    getMovieGenres,
    getMoviesByGenre
} 