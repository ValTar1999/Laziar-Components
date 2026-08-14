import { booleanAttribute, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LzTabButtonSize, LzTabButtonVariant } from './tab-button.types';

/**
 * Tab button `@laziar/components`.
 * Figma Tab Button: `bg`/`solid` — пилюля; `line` — underline.
 */
@Component({
  selector: 'lz-tab-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tab-button.component.html',
  styleUrl: './tab-button.component.scss',
  host: {
    class: 'lz-tab-button-host',
  },
})
export class TabButton {
  readonly label = input('Tab');
  readonly active = input(false, { transform: booleanAttribute });
  readonly link = input<string | undefined>(undefined);
  readonly size = input<LzTabButtonSize>('md');
  /** Prefer `bg` (sources) or `solid` (alias); `line` for underline. */
  readonly variant = input<LzTabButtonVariant>('bg');

  /** Normalize `solid` → `bg` for data-variant SCSS. */
  protected readonly resolvedVariant = computed(() =>
    this.variant() === 'solid' ? 'bg' : this.variant(),
  );
}
