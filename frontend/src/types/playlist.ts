export interface Song {
    id: string;
    name: string;
    artist: string;
    coverUrl: string;
    duration: number;
}

export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

export interface SpotifyArtist {
    id: string;
    name: string;
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    images: SpotifyImage[];
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    duration_ms: number;
}

export interface SpotifySearchResponse {
    tracks: {
        items: SpotifyTrack[];
    };
}

export interface Playlist {
    id: number;
    name: string;
    description: string;
    coverUrl: string | null;
    song_count: number;
    songs?: Song[];
    created_at: string;
    updated_at: string;
}

export interface PlaylistService {
    getAll(): Promise<Playlist[]>;
    getById(id: number): Promise<Playlist>;
    create(data: FormData): Promise<{ data: Playlist }>;
    update(id: number, data: FormData): Promise<Playlist>;
    delete(id: number): Promise<void>;
    addSong(playlistId: number, songId: string): Promise<void>;
    removeSong(playlistId: number, songId: string): Promise<void>;
    searchSongs(query: string): Promise<{ data: Song[] }>;
} 