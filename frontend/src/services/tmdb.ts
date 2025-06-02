import type { Movie } from '@/types';
import axios from 'axios';

interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    director?: string;
    release_date: string;
    overview: string;
}

interface TMDBMovieDetail extends TMDBMovie {
    genres: TMDBGenre[];
    runtime: number;
    budget: number;
    revenue: number;
    production_companies: {
        name: string;
        logo_path: string | null;
    }[];
    credits?: {
        cast: {
            id: number;
            name: string;
            character: string;
            profile_path: string | null;
        }[];
        crew: {
            id: number;
            name: string;
            job: string;
            department: string;
        }[];
    };
}

interface TMDBGenre {
    id: number;
    name: string;
}

interface TMDBGenresResponse {
    genres: TMDBGenre[];
}

interface TMDBResponse {
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
    page: number;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'zh-TW'
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 添加請求攔截器
tmdbClient.interceptors.request.use(
    (config) => {
        // 確保每個請求都帶有 API key
        if (!config.params) {
            config.params = {};
        }
        config.params.api_key = TMDB_API_KEY;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加響應攔截器
tmdbClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('TMDB API 錯誤:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getTrendingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbClient.get<TMDBResponse>('/trending/movie/week');
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : '/images/no-poster.png',
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average
        }));
    } catch (error) {
        console.error('獲取熱門電影失敗:', error);
        return [];
    }
};

export const searchMovies = async (query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> => {
    try {
        const response = await tmdbClient.get<TMDBResponse>('/search/movie', {
            params: { query, page }
        });
        return {
            results: response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : '/images/no-poster.png',
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('搜索電影失敗:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getImageUrl = (path: string, size = 'original'): string => {
    if (!path) return '/images/no-poster.png';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getMovieGenres = async (): Promise<TMDBGenre[]> => {
    try {
        const response = await tmdbClient.get<TMDBGenresResponse>('/genre/movie/list');
        return response.data.genres;
    } catch (error) {
        console.error('獲取電影類型失敗:', error);
        return [];
    }
};

export const getMovieDetails = async (movieId: number): Promise<TMDBMovieDetail | null> => {
    try {
        const response = await tmdbClient.get<TMDBMovieDetail>(`/movie/${movieId}`, {
            params: {
                append_to_response: 'credits'
            }
        });
        return response.data;
    } catch (error) {
        console.error('獲取電影詳情失敗:', error);
        return null;
    }
};