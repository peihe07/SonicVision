import type { PlaylistService } from '@/types/playlist'
import type { WatchlistService } from '@/types/watchlist'
import type { App } from 'vue'
import { createPlaylistService } from './playlist'
import { createWatchlistService } from './watchlist'

export function setupServices(app: App) {
    const playlistService = createPlaylistService()
    const watchlistService = createWatchlistService()

    app.provide<PlaylistService>('playlistService', playlistService)
    app.provide<WatchlistService>('watchlistService', watchlistService)
} 