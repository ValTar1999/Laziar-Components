import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  input,
  signal,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Loading } from '../loading/loading.component';

/**
 * A page or section that is still loading: a small spinner and a muted label,
 * centred, 40px from what is above.
 *
 * Screen readers hear the label, or `srLabel` when there is none. The status
 * region starts empty and is filled after the first render: a live region that
 * appears already holding its text is often not announced.
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
  /** Announced instead of the label when there is no visible one. */
  readonly srLabel = input('Se încarcă...');

  private readonly rendered = signal(false);

  protected readonly announcement = computed(() =>
    this.rendered() ? this.label() || this.srLabel() : '',
  );

  constructor() {
    afterNextRender(() => this.rendered.set(true));
  }
}
