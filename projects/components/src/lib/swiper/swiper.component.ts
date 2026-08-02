import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import type SwiperType from 'swiper';
import 'swiper/css';

register();

/**
 * Swiper carousel `@laziar/components`.
 * API/стили — эталон publikator (`SwiperComponent` / carousel).
 * Project slides via content projection into `swiper-slide` elements.
 */
@Component({
  selector: 'lz-swiper',
  standalone: true,
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'lz-swiper-host',
  },
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
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

  ngAfterViewInit(): void {
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
