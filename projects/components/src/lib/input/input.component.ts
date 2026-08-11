import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LzInputAppearance, LzInputSize, LzInputType, LzInputButtonPosition } from './input.types';
import { LzButtonSize } from '../button/button.types';
import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import { Tooltip } from '../tooltip/tooltip.component';

// Module-level counter for stable, unique field ids. Server and client increment in the
// same component-creation order, so the generated id is SSR-hydration-safe.
let nextInputFieldId = 0;

/**
 * Input field `@laziar/components`.
 * API/styles — union: frontend + publikator (`InputFieldComponent`).
 */
@Component({
  selector: 'lz-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  imports: [CommonModule, FormsModule, Button, Icon, Tooltip],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'lz-input-host',
  },
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly helperText = input('');
  readonly type = input<LzInputType>('text');
  readonly placeholder = input('');
  readonly iconButton = input<string | undefined>(undefined);
  readonly error = input(false, { transform: booleanAttribute });
  readonly size = input<LzInputSize>('lg');
  readonly withButton = input<LzInputButtonPosition | null>(null);
  readonly buttonLabel = input('');
  readonly prefix = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Full pill rounding for search-style fields. */
  readonly pill = input(false, { transform: booleanAttribute });
  /**
   * `laziarPanel` — light bordered search field on grey page (Figma Laziar search).
   */
  readonly appearance = input<LzInputAppearance>('default');
  /** Native autocomplete token (e.g. 'email', 'current-password'); null omits the attribute. */
  readonly autocomplete = input<string | null>(null);
  /** Tooltip when password is hidden. */
  readonly showPasswordLabel = input('Show password');
  /** Tooltip when password is visible. */
  readonly hidePasswordLabel = input('Hide password');

  readonly valueChange = output<string>();

  /** Stable unique id linking the <label for> to the <input id>. */
  readonly inputId = `lz-input-${nextInputFieldId++}`;

  protected readonly value = signal('');
  protected readonly initialType = computed(() => this.type());
  protected readonly currentType = signal<LzInputType>('text');

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected readonly showClearButton = computed(
    () => this.currentType() === 'search' && this.value().length > 0 && !this.effectiveDisabled(),
  );

  protected readonly showPasswordToggle = computed(
    () => this.initialType() === 'password' && !this.showClearButton(),
  );

  protected readonly passwordTooltipText = computed(() =>
    this.currentType() === 'password' ? this.showPasswordLabel() : this.hidePasswordLabel(),
  );

  protected readonly buttonSize = computed<LzButtonSize>(() => {
    const size = this.size();
    if (!this.iconButton()) {
      return size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm';
    }
    return size === 'lg' ? 'sm' : size === 'md' ? 'md' : 'xs';
  });

  protected readonly autocompleteAttr = computed(() => {
    const explicit = this.autocomplete();
    if (explicit !== null) return explicit;
    return this.currentType() === 'search' ? 'off' : null;
  });

  constructor() {
    effect(() => {
      this.currentType.set(this.type());
    });
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);
  }

  protected togglePasswordVisibility(): void {
    if (this.initialType() === 'password') {
      const newType = this.currentType() === 'password' ? 'text' : 'password';
      this.currentType.set(newType as LzInputType);
    }
  }

  protected clearSearch(): void {
    if (this.value()) {
      this.value.set('');
      this.onChange('');
      this.onTouched();
      this.valueChange.emit('');
    }
  }
}
