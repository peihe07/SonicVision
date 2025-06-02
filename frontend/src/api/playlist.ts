import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sonicvision.uno/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 請求攔截器，添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Playlist {
    id: number;
    name: string;
    description: string;
    owner: {
        id: number;
        username: string;
        email: string;
    };
    is_public: boolean;
    created_at: string;
    updated_at: string;
    spotify_id?: string;
    cover_image?: string;
    tracks: PlaylistTrack[];
    collaborators: PlaylistCollaborator[];
    track_count: number;
    share_code?: string;
}

export interface PlaylistTrack {
    id: number;
    track_id: string;
    added_at: string;
    added_by: {
        id: number;
        username: string;
        email: string;
    };
    position: number;
}

export interface PlaylistCollaborator {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    can_edit: boolean;
    added_at: string;
}

export interface CreatePlaylistData {
    name: string;
    description?: string;
    is_public?: boolean;
}

export interface SmartPlaylist {
    id: number;
    name: string;
    description: string;
    owner: {
        id: number;
        username: string;
        email: string;
    };
    is_public: boolean;
    created_at: string;
    updated_at: string;
    criteria: {
        query: string;
        [key: string]: any;
    };
    auto_update: boolean;
    last_updated: string | null;
    track_count: number;
}

export interface CreateSmartPlaylistData {
    name: string;
    description?: string;
    is_public?: boolean;
    criteria: {
        query: string;
        [key: string]: any;
    };
    auto_update?: boolean;
}

export const playlistAPI = {
    // 獲取播放列表列表
    getPlaylists: async () => {
        const response = await api.get<Playlist[]>('/api/playlists/');
        return response.data;
    },

    // 獲取單個播放列表
    getPlaylist: async (id: number) => {
        const response = await api.get<Playlist>(`/api/playlists/${id}/`);
        return response.data;
    },

    // 創建播放列表
    createPlaylist: async (data: CreatePlaylistData) => {
        const response = await api.post<Playlist>('/api/playlists/', data);
        return response.data;
    },

    // 更新播放列表
    updatePlaylist: async (id: number, data: Partial<CreatePlaylistData>) => {
        const response = await api.patch<Playlist>(`/api/playlists/${id}/`, data);
        return response.data;
    },

    // 刪除播放列表
    deletePlaylist: async (id: number) => {
        await api.delete(`/api/playlists/${id}/`);
    },

    // 添加曲目到播放列表
    addTrack: async (playlistId: number, trackId: string) => {
        const response = await api.post<PlaylistTrack>(
            `/api/playlists/${playlistId}/add_track/`,
            { track_id: trackId }
        );
        return response.data;
    },

    // 從播放列表移除曲目
    removeTrack: async (playlistId: number, trackId: string) => {
        await api.post(`/api/playlists/${playlistId}/remove_track/`, {
            track_id: trackId
        });
    },

    // 重新排序播放列表中的曲目
    reorderTracks: async (playlistId: number, trackPositions: string[]) => {
        await api.post(`/api/playlists/${playlistId}/reorder_tracks/`, {
            track_positions: trackPositions
        });
    },

    // 添加協作者
    addCollaborator: async (playlistId: number, userId: number, canEdit: boolean = true) => {
        const response = await api.post<PlaylistCollaborator>(
            `/api/playlists/${playlistId}/add_collaborator/`,
            { user_id: userId, can_edit: canEdit }
        );
        return response.data;
    },

    // 移除協作者
    removeCollaborator: async (playlistId: number, userId: number) => {
        await api.post(`/api/playlists/${playlistId}/remove_collaborator/`, {
            user_id: userId
        });
    },

    // 上傳播放列表封面
    uploadCover: async (playlistId: number, coverFile: File): Promise<Playlist> => {
        const formData = new FormData();
        formData.append('cover', coverFile);

        const response = await api.post<Playlist>(
            `/api/playlists/${playlistId}/cover/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // 生成分享連結
    generateShareLink: async (playlistId: number): Promise<{ share_code: string; share_url: string }> => {
        const response = await api.post<{ share_code: string; share_url: string }>(
            `/api/playlists/${playlistId}/share/`
        );
        return response.data;
    },

    // 通過分享代碼獲取播放列表
    getPlaylistByShareCode: async (shareCode: string): Promise<Playlist> => {
        const response = await api.get<Playlist>(`/api/playlists/share/${shareCode}/`);
        return response.data;
    },
};

export const smartPlaylistAPI = {
    // 獲取智能播放列表列表
    getSmartPlaylists: async () => {
        const response = await api.get<SmartPlaylist[]>('/api/smart-playlists/');
        return response.data;
    },

    // 獲取單個智能播放列表
    getSmartPlaylist: async (id: number) => {
        const response = await api.get<SmartPlaylist>(`/api/smart-playlists/${id}/`);
        return response.data;
    },

    // 創建智能播放列表
    createSmartPlaylist: async (data: CreateSmartPlaylistData) => {
        const response = await api.post<SmartPlaylist>('/api/smart-playlists/', data);
        return response.data;
    },

    // 更新智能播放列表
    updateSmartPlaylist: async (id: number, data: Partial<CreateSmartPlaylistData>) => {
        const response = await api.put<SmartPlaylist>(`/api/smart-playlists/${id}/`, data);
        return response.data;
    },

    // 刪除智能播放列表
    deleteSmartPlaylist: async (id: number) => {
        await api.delete(`/api/smart-playlists/${id}/`);
    }
}; 