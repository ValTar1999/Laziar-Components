import { Component } from '@angular/core';

/** Placeholder scaffold component for the @laziar/components library. */
@Component({
  selector: 'lz-components',
  standalone: true,
  imports: [],
  template: ` <p class="lz-scaffold__label">@laziar/components works!</p> `,
  styles: `
    :host {
      display: block;
      padding: var(--lz-space-4);
      border-radius: var(--lz-radius-lg);
      background-color: var(--lz-color-surface);
      border: 1px solid var(--lz-color-border);
      color: var(--lz-color-text-primary);
      font-family: var(--lz-font-sans);
      font-size: var(--lz-font-size-sm);
      line-height: var(--lz-line-height-sm);
      box-shadow: var(--lz-shadow-xs);
      transition:
        background-color var(--lz-duration-normal) var(--lz-easing-standard),
        border-color var(--lz-duration-normal) var(--lz-easing-standard),
        color var(--lz-duration-normal) var(--lz-easing-standard);
    }

    .lz-scaffold__label {
      margin: 0;
      color: var(--lz-color-text-secondary);
    }
  `,
})
export class Components {}
