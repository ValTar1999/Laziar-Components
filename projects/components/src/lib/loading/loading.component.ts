import { Component, input } from '@angular/core';
import { LzLoadingColor, LzLoadingSize, LzLoadingVariant } from './loading.types';

/** Spinner / dots loader (publikator `app-loading`). */
@Component({
  selector: 'lz-loading',
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class Loading {
  readonly color = input<LzLoadingColor>('black');
  readonly size = input<LzLoadingSize>('xl');
  readonly variant = input<LzLoadingVariant>('spinner');

  protected readonly dots = [0, 1, 2, 3, 4, 5, 6, 7];

  protected dotStyle(index: number): Record<string, string> {
    const angle = (index * 360) / 8;
    const radius = 40;
    const rad = (angle * Math.PI) / 180;
    return {
      top: `${50 + radius * Math.sin(rad)}%`,
      left: `${50 + radius * Math.cos(rad)}%`,
      animationDelay: `${index * 0.1}s`,
    };
  }
}
