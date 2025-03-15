export interface Movie {
    id: number;
    title: string;
    year: number;
    posterUrl: string;
    duration: number;
    genres: string[];
    watched?: boolean;
}

export interface Watchlist {
    id: number;
    name: string;
    description: string;
    coverUrl: string | null;
    owner: string;
    movie_count: number;
    watched_count: number;
    is_public: boolean;
    movies: Movie[];
    created_at: string;
    updated_at: string;
}

export interface TmdbList {
    id: number;
    name: string;
    description: string;
    posterPath: string;
    itemCount: number;
}

export interface WatchlistService {
    getAll(): Promise<Watchlist[]>;
    getById(id: number): Promise<Watchlist>;
    create(data: FormData): Promise<{ data: Watchlist }>;
    update(id: number, data: FormData): Promise<Watchlist>;
    delete(id: number): Promise<void>;
    addMovie(watchlistId: number, movieId: number): Promise<void>;
    removeMovie(watchlistId: number, movieId: number): Promise<void>;
    toggleWatched(watchlistId: number, movieId: number): Promise<void>;
    searchMovies(query: string): Promise<{ data: Movie[] }>;
    searchTmdbLists(query: string): Promise<{ data: TmdbList[] }>;
    importTmdbList(listId: number): Promise<{ data: Watchlist }>;
} 