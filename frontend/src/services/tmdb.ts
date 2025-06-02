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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sonicvision.uno';

const tmdbClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const getTrendingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbClient.get<TMDBResponse>('/api/tmdb/trending-movies/');
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/no-poster.png',
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
        const response = await tmdbClient.get<TMDBResponse>('/api/tmdb/search-movies/', {
            params: { query, page }
        });
        return {
            results: response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/no-poster.png',
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
    return `https://image.tmdb.org/t/p/${size}${path}`;
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