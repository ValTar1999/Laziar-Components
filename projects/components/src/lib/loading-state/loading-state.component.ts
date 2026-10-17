import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Loading } from '../loading/loading.component';

/**
 * A page or section that is still loading: a small spinner and a muted label,
 * centred, 40px from what is above. The label is announced to screen readers.
 */
@Component({
  selector: 'lz-loading-state',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Loading],
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-loading-state-host',
  },
})
export class LoadingState {
  /** e.g. "Se încarcă short-urile..." */
  readonly label = input('');
}
