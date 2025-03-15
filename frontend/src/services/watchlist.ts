import type { Watchlist, WatchlistService } from '@/types/watchlist';
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

export function createWatchlistService(): WatchlistService {
    return {
        async getAll() {
            try {
                const response = await axios.get<Watchlist[]>(`${API_BASE_URL}/watchlists/`);
                return response.data;
            } catch (error) {
                console.error('獲取片單列表失敗:', error);
                return [];
            }
        },

        async getById(id: number) {
            try {
                const response = await axios.get<Watchlist>(`${API_BASE_URL}/watchlists/${id}/`);
                return response.data;
            } catch (error) {
                console.error(`獲取片單 ${id} 失敗:`, error);
                throw error;
            }
        },

        async create(data: FormData) {
            const response = await axios.post<Watchlist>(`${API_BASE_URL}/watchlists/`, data);
            return { data: response.data };
        },

        async update(id: number, data: FormData) {
            const response = await axios.put<Watchlist>(`${API_BASE_URL}/watchlists/${id}/`, data);
            return response.data;
        },

        async delete(id: number) {
            await axios.delete(`${API_BASE_URL}/watchlists/${id}/`);
        },

        async addMovie(watchlistId: number, movieId: number) {
            await axios.post(`${API_BASE_URL}/watchlists/${watchlistId}/movies/${movieId}/`);
        },

        async removeMovie(watchlistId: number, movieId: number) {
            await axios.delete(`${API_BASE_URL}/watchlists/${watchlistId}/movies/${movieId}/`);
        },

        async toggleWatched(watchlistId: number, movieId: number) {
            await axios.put(`${API_BASE_URL}/watchlists/${watchlistId}/movies/${movieId}/watched/`);
        },

        async searchMovies(query: string) {
            const response = await axios.get(`${API_BASE_URL}/movies/search/`, {
                params: { q: query }
            });
            return response.data;
        },

        async searchTmdbLists(query: string) {
            const response = await axios.get(`${API_BASE_URL}/tmdb/lists/search/`, {
                params: { q: query }
            });
            return response.data;
        },

        async importTmdbList(listId: number) {
            const response = await axios.post(`${API_BASE_URL}/tmdb/lists/import/`, {
                list_id: listId
            });
            return response.data;
        }
    };
} 