import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  input,
  output,
  signal,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import {
  LzButtonColor,
  LzButtonIconPosition,
  LzButtonIconVariant,
  LzButtonSize,
  LzButtonType,
  LzButtonVariant,
} from './button.types';
import { Icon } from '../icon/icon.component';

/**
 * Кнопка `@laziar/components`.
 * API/стили — эталон publikator (`button.ts` + component).
 */
@Component({
  selector: 'lz-button',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [Icon],
  host: {
    class: 'lz-button-host',
    '[class.lz-button-host--full]': 'fullWidth()',
    '[class.lz-button-host--pill]': 'resolvedPill()',
  },
})
export class Button {
  readonly label = input('');
  readonly variant = input<LzButtonVariant>('primary');
  readonly size = input<LzButtonSize>('md');
  readonly type = input<LzButtonType>('button');
  /** Icon name rendered via `lz-icon`; custom — `[lzButtonIcon]`. */
  readonly icon = input<string | undefined>(undefined);
  /** Passed to `lz-icon` `type`. */
  readonly iconVariant = input<LzButtonIconVariant | undefined>(undefined);
  /** В publikator — `iconDirection`. */
  readonly iconPosition = input<LzButtonIconPosition>('right');
  readonly iconClass = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  /** В publikator — `rounded`. */
  readonly pill = input(false, { transform: booleanAttribute });
  readonly color = input<LzButtonColor>('gray');
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaCurrentPage = input(false, { transform: booleanAttribute });
  readonly clicked = output<void>();

  /** @deprecated Используй `iconPosition`. */
  private readonly iconPositionAlias = signal<LzButtonIconPosition | undefined>(undefined);
  /** @deprecated Используй `pill`. */
  private readonly pillAlias = signal<boolean | undefined>(undefined);

  /** @deprecated Используй `iconPosition`. */
  @Input()
  set iconDirection(value: LzButtonIconPosition) {
    this.iconPositionAlias.set(value);
  }

  /** @deprecated Используй `pill`. */
  @Input()
  set rounded(value: boolean) {
    this.pillAlias.set(value);
  }

  protected readonly resolvedIconPosition = computed(
    () => this.iconPositionAlias() ?? this.iconPosition(),
  );

  protected readonly resolvedPill = computed(() => this.pillAlias() ?? this.pill());

  /** `!!icon && !label` — как в publikator. */
  protected readonly isIconOnly = computed(() => !!this.icon() && !this.label().trim());

  /** Keep `lz-button__icon` — bare `[class]` replaces the whole class attr. */
  protected readonly iconWrapperClass = computed(() =>
    ['lz-button__icon', this.iconClass() ?? ''].filter(Boolean).join(' '),
  );

  protected onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
