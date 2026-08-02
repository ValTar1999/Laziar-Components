import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { LZ_THEME_STORAGE_KEY, LzResolvedTheme, LzThemeMode } from './theme.types';

/**
 * Controls light / dark / auto theming via `data-theme` on `<html>`.
 * Persists preference in `localStorage` and follows `prefers-color-scheme` in auto mode.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = LZ_THEME_STORAGE_KEY;
  private mediaQuery: MediaQueryList | null = null;
  private mediaListener: ((event: MediaQueryListEvent) => void) | null = null;

  private readonly modeSignal = signal<LzThemeMode>('auto');
  private readonly systemDarkSignal = signal(false);

  /** Current user preference: light | dark | auto. */
  readonly mode = this.modeSignal.asReadonly();

  /** Effective theme after resolving auto against the OS. */
  readonly resolved = computed<LzResolvedTheme>(() => {
    const mode = this.modeSignal();
    if (mode === 'auto') {
      return this.systemDarkSignal() ? 'dark' : 'light';
    }
    return mode;
  });

  readonly isDark = computed(() => this.resolved() === 'dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  /** Apply a theme mode and persist it. */
  setMode(mode: LzThemeMode): void {
    this.modeSignal.set(mode);
    this.persist(mode);
    this.applyToDom(mode);
  }

  toggleLightDark(): void {
    const next: LzThemeMode = this.resolved() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  /** Re-read storage / system preference (e.g. after SSR hydration). */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.bindSystemPreference();
    const stored = this.readStored();
    this.modeSignal.set(stored);
    this.applyToDom(stored);
  }

  private bindSystemPreference(): void {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDarkSignal.set(this.mediaQuery.matches);

    this.mediaListener = (event: MediaQueryListEvent) => {
      this.systemDarkSignal.set(event.matches);
      if (this.modeSignal() === 'auto') {
        this.applyToDom('auto');
      }
    };

    this.mediaQuery.addEventListener('change', this.mediaListener);
  }

  private applyToDom(mode: LzThemeMode): void {
    const resolved: LzResolvedTheme =
      mode === 'auto' ? (this.systemDarkSignal() ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-mode', mode);
  }

  private readStored(): LzThemeMode {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw === 'light' || raw === 'dark' || raw === 'auto') {
        return raw;
      }
    } catch {
      // private mode / blocked storage
    }
    return 'auto';
  }

  private persist(mode: LzThemeMode): void {
    try {
      localStorage.setItem(this.storageKey, mode);
    } catch {
      // ignore
    }
  }
}
