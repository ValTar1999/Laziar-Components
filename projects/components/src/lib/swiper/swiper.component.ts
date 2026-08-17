import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import type SwiperType from 'swiper';

/**
 * Swiper is registered lazily, on first use of this component.
 *
 * This used to be a top-level `import { register }` + a module-scope
 * `register()` call, plus a top-level `import 'swiper/css'`. Because the
 * library ships as a single fesm bundle with one entry point, that made swiper
 * a hard dependency of **every** consumer: importing anything at all — even
 * just `ThemeService` — pulled the whole swiper web-component bundle into the
 * app's initial JS (measured: ~190 kB), and broke Vitest-based consumers
 * outright with `Unknown file extension ".css" for swiper/swiper.css`.
 *
 * A dynamic import keeps swiper out of the module graph until `lz-swiper` is
 * actually rendered. `swiper/css` is not imported at all: this component
 * renders the `<swiper-container>` custom element, which carries its own
 * styles in shadow DOM — that stylesheet is for the classic, non-element API.
 */
let swiperRegistration: Promise<void> | null = null;

function ensureSwiperRegistered(): Promise<void> {
  swiperRegistration ??= import('swiper/element/bundle').then(({ register }) => {
    register();
  });
  return swiperRegistration;
}

/**
 * Swiper carousel `@laziar/components`.
 * API/стили — эталон publikator (`SwiperComponent` / carousel).
 * Project slides via content projection into `swiper-slide` elements.
 */
@Component({
  selector: 'lz-swiper',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'lz-swiper-host',
  },
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('swiper', { static: false }) private swiperRef?: ElementRef<
    HTMLElement & { swiper?: SwiperType }
  >;

  private swiper?: SwiperType;
  private slideChangeHandler?: () => void;

  /** Same breakpoints as publikator carousel. */
  protected readonly breakpoints: Record<string, { slidesPerView: number }> = {
    '768': { slidesPerView: 2 },
    '992': { slidesPerView: 3 },
  };

  protected readonly isBeginning = signal(true);
  protected readonly isEnd = signal(false);

  constructor() {
    // Start registration as early as possible so the custom element upgrades
    // by the time the view is ready; ngAfterViewInit still awaits it.
    if (isPlatformBrowser(this.platformId)) {
      void ensureSwiperRegistered();
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Registration is lazy now, so the element may not be upgraded yet and
    // `el.swiper` would be undefined if we read it synchronously.
    await ensureSwiperRegistered();
    await customElements.whenDefined('swiper-container');

    const el = this.swiperRef?.nativeElement;
    this.swiper = el?.swiper;

    if (!this.swiper) {
      return;
    }

    this.isBeginning.set(this.swiper.isBeginning);
    this.isEnd.set(this.swiper.isEnd);

    this.slideChangeHandler = () => {
      if (!this.swiper) return;
      this.isBeginning.set(this.swiper.isBeginning);
      this.isEnd.set(this.swiper.isEnd);
    };

    this.swiper.on('slideChange', this.slideChangeHandler);
  }

  ngOnDestroy(): void {
    if (this.swiper && this.slideChangeHandler) {
      this.swiper.off('slideChange', this.slideChangeHandler);
    }
  }

  protected prevSlide(): void {
    this.swiper?.slidePrev();
  }

  protected nextSlide(): void {
    this.swiper?.slideNext();
  }
}
