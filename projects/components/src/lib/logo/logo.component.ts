import { Component, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { RouterLink } from '@angular/router';

/**
 * Laziar wordmark logo for `@laziar/components`.
 * Ported from frontend `app-logo`.
 */
@Component({
  selector: 'lz-logo',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  host: {
    class: 'lz-logo-host',
  },
})
export class Logo {
  readonly link = input('/');
  readonly ariaLabel = input('Laziar acasă');
}
