export interface Music {
    id: string | number;
    title: string;
    artist: string;
    coverUrl: string;
    rating: number;
    spotifyUrl?: string;
    youtubeUrl?: string;
}

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
}

export interface TMDBGenre {
    id: number;
    name: string;
}

export interface TMDBMovieDetail {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    director?: string;
    release_date: string;
    overview: string;
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

export interface ApiResponse<T> {
    data: {
        items: T[];
        total: number;
    };
} 