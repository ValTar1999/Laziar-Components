export interface LzVideoPlayerSource {
  src: string;
  type?: string;
}

export interface LzVideoPlaylistItem {
  sources: LzVideoPlayerSource[];
  title?: string;
  duration?: string;
}

export interface LzVideoNuevoOptions {
  license?: string;
  skin?: string;
  logo?: string;
  logourl?: string;
  logoposition?: string;
  logomin?: boolean;
  playlistUI?: boolean;
  playlistShow?: boolean;
  playlistAutoHide?: boolean;
  playlistNavigation?: boolean;
  playlistRepeat?: boolean;
}
