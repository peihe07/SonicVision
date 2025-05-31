export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string | File;
    createdAt: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: string;
    voteAverage: number;
}

export interface Music {
    id: number;
    title: string;
    artist: string;
    coverUrl: string;
    rating: number;
    spotifyUrl?: string;
    youtubeUrl?: string;
    previewUrl?: string;
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

export interface Comment {
    id: number;
    content: string;
    author: string;
    authorAvatar: string;
    createdAt: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    category: string;
    likes: number;
    isLiked: boolean;
    comments: Comment[];
    createdAt: string;
    isExpanded?: boolean;
}

export interface NewPost {
    title: string;
    content: string;
    media_url?: string;
}

export * from './api';
export * from './movie';
export * from './playlist';
export * from './user';

