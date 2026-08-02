import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { LzBadgeColor, LzBadgeIconPosition, LzBadgeIconVariant, LzBadgeSize } from './badge.types';
import { Icon } from '../icon/icon.component';

/**
 * Badge `@laziar/components`.
 * Union frontend + publikator.
 */
@Component({
  selector: 'lz-badge',
  standalone: true,
  imports: [Icon],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  host: {
    class: 'lz-badge-host',
  },
})
export class Badge {
  /** Icon name for `lz-icon`; custom via `[lzBadgeIcon]`. */
  readonly icon = input<string | undefined>(undefined);
  /** Image URL for badge avatar/image. */
  readonly img = input<string | undefined>(undefined);
  /** Whether icon is clickable and emits events. */
  readonly iconClickable = input(false, { transform: booleanAttribute });
  /** Accessible name for the clickable-icon button; consumers pass a localized string. */
  readonly iconAriaLabel = input('');
  /** Icon position relative to badge content. */
  readonly iconPosition = input<LzBadgeIconPosition>('left');
  /** Icon style variant for future `lz-icon`. */
  readonly iconVariant = input<LzBadgeIconVariant>('solid');
  /** Badge color theme. */
  readonly color = input<LzBadgeColor>('gray');
  /** Badge size scale. */
  readonly size = input<LzBadgeSize>('sm');
  /** Whether to show border ring. */
  readonly border = input(false, { transform: booleanAttribute });
  /** Whether badge should be pill-shaped (rounded-full). */
  readonly pill = input(false, { transform: booleanAttribute });
  /** Whether badge is disabled. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Emitted when clickable icon is clicked. */
  readonly iconClick = output<void>();

  /** Whether icon is present and should affect layout. */
  protected readonly hasIcon = computed(() => !!this.icon());

  /** Resolve `magrnta` alias to canonical `magenta`. */
  protected readonly resolvedColor = computed(() => {
    const color = this.color();
    return color === 'magrnta' ? 'magenta' : color;
  });

  /** Handle icon click when clickable. */
  protected onIconClick(): void {
    if (this.iconClickable() && !this.disabled()) {
      this.iconClick.emit();
    }
  }
}
