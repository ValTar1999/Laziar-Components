import { booleanAttribute, Component, computed, Input, input, output, signal } from '@angular/core';
import {
  LzButtonColor,
  LzButtonIconPosition,
  LzButtonIconVariant,
  LzButtonSize,
  LzButtonType,
  LzButtonVariant,
} from './button.types';

/**
 * Reference button for `@laziar/components`.
 * Unified API from publikator + agora-frontend (`docs/analysis/components-comparison.md`).
 */
@Component({
  selector: 'lz-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class.lz-button-host--full]': 'fullWidth()',
  },
})
export class Button {
  /** Visible text when not using projected content. */
  readonly label = input('');

  /** Visual style. */
  readonly variant = input<LzButtonVariant>('primary');

  /** Control size. */
  readonly size = input<LzButtonSize>('md');

  /** Native button `type`. */
  readonly type = input<LzButtonType>('button');

  /**
   * Icon name (until `lz-icon` ships — renders a named placeholder).
   * Project custom markup with `[lzButtonIcon]`.
   */
  readonly icon = input<string | undefined>(undefined);

  /** Icon style hint for future `lz-icon`. */
  readonly iconVariant = input<LzButtonIconVariant | undefined>(undefined);

  /** Icon placement relative to the label. */
  readonly iconPosition = input<LzButtonIconPosition>('right');

  /** Extra CSS class on the icon wrapper. */
  readonly iconClass = input<string | undefined>(undefined);

  /** Disables the control and blocks `buttonClick`. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Pill (fully rounded) shape. */
  readonly pill = input(false, { transform: booleanAttribute });

  /** Palette tone (`gray` → neutral tokens, `red` → primary, …). */
  readonly color = input<LzButtonColor>('gray');

  /** Stretch to 100% of the host width. */
  readonly fullWidth = input(false, { transform: booleanAttribute });

  /** Accessible name (required for icon-only). */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** When true, sets `aria-current="page"` (pagination). */
  readonly ariaCurrentPage = input(false, { transform: booleanAttribute });

  /** Emitted on activation when not disabled. */
  readonly buttonClick = output<void>();

  /** @deprecated Prefer {@link iconPosition}. */
  private readonly iconPositionAlias = signal<LzButtonIconPosition | undefined>(undefined);

  /** @deprecated Prefer {@link pill}. */
  private readonly pillAlias = signal<boolean | undefined>(undefined);

  /**
   * @deprecated Use `iconPosition` instead.
   */
  @Input()
  set iconDirection(value: LzButtonIconPosition) {
    this.iconPositionAlias.set(value);
  }

  /**
   * @deprecated Use `pill` instead.
   */
  @Input()
  set rounded(value: boolean) {
    this.pillAlias.set(value);
  }

  protected readonly resolvedIconPosition = computed(
    () => this.iconPositionAlias() ?? this.iconPosition(),
  );

  protected readonly resolvedPill = computed(() => this.pillAlias() ?? this.pill());

  protected readonly isIconOnly = computed(() => {
    if (this.variant() === 'iconOnly') {
      return true;
    }
    return !!this.icon() && !this.label().trim();
  });

  protected readonly showIcon = computed(() => !!this.icon() || this.variant() === 'iconOnly');

  protected readonly showLabel = computed(() => !this.isIconOnly() && !!this.label().trim());

  protected readonly effectiveAriaLabel = computed(() => {
    const explicit = this.ariaLabel();
    if (explicit) {
      return explicit;
    }
    if (this.isIconOnly()) {
      return this.icon() || this.label() || 'Button';
    }
    return null;
  });

  protected onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.buttonClick.emit();
  }
}
