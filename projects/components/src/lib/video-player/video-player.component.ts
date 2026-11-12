import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
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
  src?: (source: { src: string; type: string }) => void;
  uniquePlaylist?: string;
  dispose: () => void;
}

type VideoJsFactory = (el: HTMLVideoElement, options: Record<string, unknown>) => VideoJsPlayer;

/**
 * One load per asset URL for the whole page, shared by every player.
 *
 * A failed load is forgotten and its element removed, so the next player asks
 * for the asset again. Without that, one 404 left a dead `<script>` behind and
 * every later player waited for a `load` event that had already come and gone.
 */
const assetLoads = new Map<string, Promise<void>>();

function loadAssetOnce(
  url: string,
  create: () => HTMLScriptElement | HTMLLinkElement,
  parent: HTMLElement,
): Promise<void> {
  const pending = assetLoads.get(url);
  if (pending) return pending;

  const load = new Promise<void>((resolve) => {
    const element = create();
    element.addEventListener('load', () => resolve(), { once: true });
    element.addEventListener(
      'error',
      () => {
        assetLoads.delete(url);
        element.remove();
        // Resolved, not rejected: whether the player can start is decided by
        // `window.videojs` existing, so an optional asset (a language file)
        // failing must not block it.
        resolve();
      },
      { once: true },
    );
    parent.appendChild(element);
  });
  assetLoads.set(url, load);
  return load;
}

/**
 * Video player `@laziar/components`.
 * API/стили — эталон publikator (`VideoPlayerComponent`): Video.js + Nuevo plugin
 * loaded from host-app assets (not npm). Host must serve Video.js assets.
 */
@Component({
  selector: 'lz-video-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  host: {
    class: 'lz-video-player-host',
  },
})
export class VideoPlayer {
  private readonly document = inject(DOCUMENT);

  private readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');

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

  /** Video.js itself did not load, so there is nothing to build a player with. */
  private readonly assetsFailed = signal(false);

  /**
   * Derived, not latched: a source that arrives after the first render (the
   * usual case with data from an API) brings the `<video>` in and starts the player.
   */
  protected readonly unavailable = computed(() => !this.hasPlayableSource() || this.assetsFailed());

  private player: VideoJsPlayer | null = null;
  /** The `<video>` the current player was built on, or is being built on. */
  private playerElement: HTMLVideoElement | null = null;
  private destroyed = false;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    // The `<video>` comes and goes with `unavailable`; the player follows it.
    effect(() => {
      const element = this.videoElement()?.nativeElement ?? null;
      untracked(() => this.attachTo(element));
    });

    // A source changed under a running player.
    effect(() => {
      const src = this.videoSrc();
      const items = this.playlist();
      untracked(() => this.updateSource(src, items));
    });

    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.disposePlayer();
    });
  }

  private attachTo(element: HTMLVideoElement | null): void {
    if (element === this.playerElement) return;

    this.disposePlayer();
    this.playerElement = element;
    if (!element) return;

    this.loadVideoJsAssets().then(() => {
      // The component, or this `<video>`, went away while the assets loaded.
      if (this.destroyed || this.playerElement !== element) return;

      const videojs = this.document.defaultView?.videojs;
      if (typeof videojs !== 'function') {
        this.assetsFailed.set(true);
        return;
      }

      this.player = this.createPlayer(videojs, element);
    });
  }

  private createPlayer(videojs: VideoJsFactory, element: HTMLVideoElement): VideoJsPlayer {
    const player = videojs(element, {
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

    if (typeof player.nuevo === 'function') {
      player.nuevo(nuevo);
    }

    const items = this.playlist();
    if (items.length && typeof player.playlist === 'function') {
      player.playlist(items);
      player.uniquePlaylist = this.playlistId();
    }

    return player;
  }

  private updateSource(src: string, items: LzVideoPlaylistItem[]): void {
    const player = this.player;
    if (!player) return;

    if (items.length && typeof player.playlist === 'function') {
      player.playlist(items);
    } else if (src.trim() && typeof player.src === 'function') {
      player.src({ src, type: 'video/mp4' });
    }
  }

  private disposePlayer(): void {
    this.player?.dispose();
    this.player = null;
    this.playerElement = null;
  }

  private hasPlayableSource(): boolean {
    if (this.videoSrc().trim()) {
      return true;
    }
    return this.playlist().some((item) => item.sources?.some((source) => source.src));
  }

  private loadVideoJsAssets(): Promise<void> {
    const doc = this.document;
    const base = this.assetsPath().replace(/\/$/, '');
    const lang = this.language();

    const stylesheet = (id: string, href: string): Promise<void> =>
      loadAssetOnce(
        href,
        () => {
          const link = doc.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.dataset['vjsAsset'] = id;
          return link;
        },
        doc.head,
      );

    const script = (id: string, src: string): Promise<void> =>
      loadAssetOnce(
        src,
        () => {
          const element = doc.createElement('script');
          element.src = src;
          element.dataset['vjsAsset'] = id;
          return element;
        },
        doc.body,
      );

    return stylesheet('videojs-core-css', `${base}/video-js.min.css`)
      .then(() => stylesheet('videojs-shaka-css', `${base}/skins/shaka/videojs.min.css`))
      .then(() => script('videojs-core-js', `${base}/video.min.js`))
      .then(() => script('videojs-nuevo-js', `${base}/nuevo.min.js`))
      .then(() => script(`videojs-lang-${lang}`, `${base}/lang/${lang}.js`));
  }
}
