import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import { LzIconVariant } from '../icon/icon.types';

/**
 * "Nothing here yet" block: a 40px gray circle with a 20px icon (Figma IMG
 * 7720:21132), a title, a muted description and an optional small button.
 *
 * `fullPage` places it as low as an empty page's state sits (128px from the top);
 * otherwise it takes 40px above and below, for an empty section of a page.
 */
@Component({
  selector: 'lz-empty-state',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Button, Icon],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-empty-state-host',
  },
})
export class EmptyState {
  readonly icon = input('inbox');
  readonly iconType = input<LzIconVariant>('outline');
  /** Title. Not called `title`, which would also become the host's native tooltip. */
  readonly heading = input('');
  /** Heading level the title is announced at (its look does not change). */
  readonly headingLevel = input(2, { transform: numberAttribute });
  readonly description = input('');
  /** Button label; no button without it. */
  readonly actionLabel = input('');
  /** Icon on the left of the button label. */
  readonly actionIcon = input<string | undefined>(undefined);
  readonly fullPage = input(false, { transform: booleanAttribute });

  readonly action = output<void>();
}
