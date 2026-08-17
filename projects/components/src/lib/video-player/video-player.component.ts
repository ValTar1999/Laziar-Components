import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { LzVideoNuevoOptions, LzVideoPlaylistItem } from './video-player.types';

declare global {
  interface Window {
    videojs?: VideoJsFactory;
  }
}

interface VideoJsPlayer {
  nuevo?: (options: Record<string, unknown>) => void;
  playlist?: (items: LzVideoPlaylistItem[]) => void;
  uniquePlaylist?: string;
  dispose: () => void;
}

type VideoJsFactory = (el: HTMLVideoElement, options: Record<string, unknown>) => VideoJsPlayer;

/**
 * Video player `@laziar/components`.
 * API/стили — эталон publikator (`VideoPlayerComponent`): Video.js + Nuevo plugin
 * loaded from host-app assets (not npm). Host must serve Video.js assets.
 */
@Component({
  selector: 'lz-video-player',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  host: {
    class: 'lz-video-player-host',
  },
})
export class VideoPlayer implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('videoPlayer') private videoElement?: ElementRef<HTMLVideoElement>;

  readonly videoSrc = input('');
  /** Host logo overlay; frontend default is `/assets/site-logo/laziar.svg`. */
  readonly logoPath = input('/assets/site-logo/laziar.svg');
  /** Base path to Video.js assets (CSS/JS), as in publikator `/assets/videojs`. */
  readonly assetsPath = input('/assets/videojs');
  readonly language = input('ro');
  readonly muted = input(true);
  readonly autoplay = input(false);
  readonly playlist = input<LzVideoPlaylistItem[]>([]);
  readonly playlistId = input('unique_playlist_id');
  readonly nuevoLicense = input('05005e4105495c57');
  readonly nuevoOptions = input<LzVideoNuevoOptions>({});

  protected readonly unavailable = signal(false);

  private player: VideoJsPlayer | null = null;

  ngOnInit(): void {
    if (!this.hasPlayableSource()) {
      this.unavailable.set(true);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || this.unavailable()) {
      return;
    }

    this.loadVideoJsAssets().then(() => {
      const videoEl = this.videoElement?.nativeElement;
      if (typeof window.videojs !== 'function' || !videoEl) {
        this.unavailable.set(true);
        return;
      }

      this.player = window.videojs(videoEl, {
        controls: true,
        autoplay: this.autoplay(),
        preload: 'auto',
        fluid: true,
        language: this.language(),
        muted: this.muted(),
        sources: [
          {
            src: this.videoSrc(),
            type: 'video/mp4',
          },
        ],
      });

      const nuevo = {
        license: this.nuevoLicense(),
        skin: 'shaka',
        logo: this.logoPath(),
        logourl: '#',
        logoposition: 'LT',
        logomin: true,
        playlistUI: true,
        playlistShow: true,
        playlistAutoHide: false,
        playlistNavigation: true,
        playlistRepeat: true,
        ...this.nuevoOptions(),
      };

      if (typeof this.player.nuevo === 'function') {
        this.player.nuevo(nuevo);
      }

      const items = this.playlist();
      if (items.length && typeof this.player.playlist === 'function') {
        this.player.playlist(items);
        this.player.uniquePlaylist = this.playlistId();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  private hasPlayableSource(): boolean {
    if (this.videoSrc().trim()) {
      return true;
    }
    return this.playlist().some((item) => item.sources?.some((source) => source.src));
  }

  private loadVideoJsAssets(): Promise<void> {
    const base = this.assetsPath().replace(/\/$/, '');

    const loadStylesheet = (id: string, href: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const existing = document.querySelector<HTMLLinkElement>(`link[data-vjs-asset="${id}"]`);
        if (existing) {
          resolve();
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset['vjsAsset'] = id;
        link.addEventListener('load', () => resolve(), { once: true });
        link.addEventListener('error', () => resolve(), { once: true });
        document.head.appendChild(link);
      });

    const loadScript = (id: string, src: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const existing = document.querySelector<HTMLScriptElement>(
          `script[data-vjs-asset="${id}"]`,
        );
        if (existing) {
          if (existing.dataset['loaded'] === 'true') {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => resolve(), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.dataset['vjsAsset'] = id;
        script.addEventListener(
          'load',
          () => {
            script.dataset['loaded'] = 'true';
            resolve();
          },
          { once: true },
        );
        script.addEventListener('error', () => resolve(), { once: true });
        document.body.appendChild(script);
      });

    const lang = this.language();

    return loadStylesheet('videojs-core-css', `${base}/video-js.min.css`)
      .then(() => loadStylesheet('videojs-shaka-css', `${base}/skins/shaka/videojs.min.css`))
      .then(() => loadScript('videojs-core-js', `${base}/video.min.js`))
      .then(() => loadScript('videojs-nuevo-js', `${base}/nuevo.min.js`))
      .then(() => loadScript(`videojs-lang-${lang}`, `${base}/lang/${lang}.js`));
  }
}
