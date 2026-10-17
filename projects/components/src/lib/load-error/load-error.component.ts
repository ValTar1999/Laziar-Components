import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Alert } from '../alert/alert.component';
import { Button } from '../button/button.component';

/**
 * Data that failed to load: an error alert with a retry button on its right,
 * the way publikator's lists report it.
 */
@Component({
  selector: 'lz-load-error',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Alert, Button],
  templateUrl: './load-error.component.html',
  styleUrl: './load-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-load-error-host',
  },
})
export class LoadError {
  /** Alert title. Not called `title`, which would also become the host's native tooltip. */
  readonly heading = input('');
  readonly text = input('');
  /** Retry button label; no button without it. */
  readonly retryLabel = input('Reîncearcă');

  readonly retry = output<void>();
}
