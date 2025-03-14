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

const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY
    }
});

export const getTrendingMovies = async (): Promise<Movie[]> => {
    const response = await tmdbClient.get<TMDBResponse>('/trending/movie/week');
    return response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`,
        vote_average: movie.vote_average,
        release_date: movie.release_date
    }));
};

export const searchMovies = async (query: string, page = 1): Promise<TMDBResponse> => {
    const response = await tmdbClient.get<TMDBResponse>('/search/movie', {
        params: {
            query,
            page,
            language: 'zh-TW'
        }
    });
    return response.data;
};

export const getImageUrl = (path: string, size = 'original'): string => {
    if (!path) return '/images/no-poster.png';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getMovieGenres = async (): Promise<TMDBGenre[]> => {
    const response = await tmdbClient.get<TMDBGenresResponse>('/genre/movie/list', {
        params: {
            language: 'zh-TW'
        }
    });
    return response.data.genres;
};

export const getMovieDetails = async (movieId: number): Promise<TMDBMovieDetail> => {
    const response = await tmdbClient.get<TMDBMovieDetail>(`/movie/${movieId}`, {
        params: {
            language: 'zh-TW',
            append_to_response: 'credits'
        }
    });
    return response.data;
};