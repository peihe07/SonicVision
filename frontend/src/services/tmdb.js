import { API_CONFIG } from '@/config/api.config'
import axios from 'axios'

const { TMDB } = API_CONFIG

// 創建 axios 實例
const tmdbApi = axios.create({
    baseURL: TMDB.BASE_URL,
    params: {
        api_key: TMDB.API_KEY,
        language: TMDB.LANGUAGE
    }
})

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
        console.error('Failed to search movies:', error)
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
        console.error('Failed to get movie details:', error)
        throw error
    }
}

// 獲取電影演員陣容
export const getMovieCredits = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/credits`)
        return response.data
    } catch (error) {
        console.error('Failed to get movie credits:', error)
        throw error
    }
}

// 獲取電影視頻
export const getMovieVideos = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/videos`)
        return response.data
    } catch (error) {
        console.error('Failed to get movie videos:', error)
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
        console.error('Failed to get movie reviews:', error)
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
        console.error('Failed to get now playing movies:', error)
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
        console.error('Failed to get upcoming movies:', error)
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
        console.error('Failed to get popular movies:', error)
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
        console.error('Failed to get top rated movies:', error)
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
        console.error('Failed to get movie recommendations:', error)
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
        console.error('Failed to get similar movies:', error)
        throw error
    }
}

// 獲取電影類型列表
export const getMovieGenres = async () => {
    try {
        const response = await tmdbApi.get('/genre/movie/list')
        return response.data
    } catch (error) {
        console.error('Failed to get movie genres:', error)
        throw error
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
        console.error('Failed to get movies by genre:', error)
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