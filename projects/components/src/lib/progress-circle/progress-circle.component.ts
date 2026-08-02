import { Component, computed, input, numberAttribute } from '@angular/core';
import { LzProgressCircleSize, LzProgressCircleVariant } from './progress-circle.types';

const SIZE_PX: Record<LzProgressCircleSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 64,
  xl: 80,
  xxl: 160,
};

const STROKE_PX: Record<LzProgressCircleSize, number> = {
  xs: 1.67,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 12,
};

/** Circular progress (publikator `app-progress-circle`). */
@Component({
  selector: 'lz-progress-circle',
  standalone: true,
  templateUrl: './progress-circle.component.html',
  styleUrl: './progress-circle.component.scss',
})
export class ProgressCircle {
  readonly progress = input(75, { transform: numberAttribute });
  readonly size = input<LzProgressCircleSize>('md');
  readonly variant = input<LzProgressCircleVariant>('red');

  protected readonly actualSize = computed(() => SIZE_PX[this.size()]);
  protected readonly strokeWidth = computed(() => STROKE_PX[this.size()]);
  protected readonly radius = computed(() => (this.actualSize() - this.strokeWidth()) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  protected readonly dashOffset = computed(
    () => this.circumference() * (1 - Math.min(100, Math.max(0, this.progress())) / 100),
  );
  protected readonly showLabel = computed(
    () => this.size() === 'lg' || this.size() === 'xl' || this.size() === 'xxl',
  );
}
