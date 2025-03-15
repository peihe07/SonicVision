import { Playlist, PlaylistService, SpotifySearchResponse } from '@/types/playlist';
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

export function createPlaylistService(): PlaylistService {
    return {
        async getAll() {
            try {
                const response = await axios.get<Playlist[]>(`${API_BASE_URL}/playlists/`);
                return response.data;
            } catch (error) {
                console.error('Error fetching playlists:', error);
                return [];
            }
        },

        async getById(id: number) {
            try {
                const response = await axios.get<Playlist>(`${API_BASE_URL}/playlists/${id}/`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching playlist ${id}:`, error);
                throw error;
            }
        },

        async create(data: FormData) {
            const response = await axios.post<{ data: Playlist }>(`${API_BASE_URL}/playlists/`, data);
            return response.data;
        },

        async update(id: number, data: FormData) {
            const response = await axios.put<Playlist>(`${API_BASE_URL}/playlists/${id}/`, data);
            return response.data;
        },

        async delete(id: number) {
            await axios.delete(`${API_BASE_URL}/playlists/${id}/`);
        },

        async addSong(playlistId: number, songId: string) {
            await axios.post(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}/`);
        },

        async removeSong(playlistId: number, songId: string) {
            await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}/`);
        },

        async searchSongs(query: string) {
            try {
                const response = await axios.get<SpotifySearchResponse>(`${API_BASE_URL}/spotify/search/`, {
                    params: { q: query, type: 'track' }
                });
                return {
                    data: response.data.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        coverUrl: track.album.images[0]?.url || '/images/no-poster.png',
                        duration: Math.floor(track.duration_ms / 1000)
                    }))
                };
            } catch (error) {
                console.error('搜索歌曲失敗:', error);
                return { data: [] };
            }
        }
    };
} 