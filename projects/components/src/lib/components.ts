import { Component } from '@angular/core';

/** Placeholder scaffold component for the @laziar/components library. */
@Component({
  selector: 'lz-components',
  standalone: true,
  imports: [],
  template: ` <p>@laziar/components works!</p> `,
  styles: `
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
  `,
})
export class Components {}
