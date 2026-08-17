import { Component } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

/** Pulsing status indicator (publikator `app-pulse-dot`). */
@Component({
  selector: 'lz-pulse-dot',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './pulse-dot.component.html',
  styleUrl: './pulse-dot.component.scss',
})
export class PulseDot {}
