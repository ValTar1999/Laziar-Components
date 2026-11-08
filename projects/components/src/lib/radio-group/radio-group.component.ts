import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Icon } from '../icon/icon.component';
import {
  LzRadioGroupAppearance,
  LzRadioGroupOrientation,
  LzRadioOption,
} from './radio-group.types';

let nextRadioGroupId = 0;

/**
 * A set of mutually exclusive options `@laziar/components`.
 * Styles follow the Laziar System reference (Figma Radio), as `lz-checkbox`
 * `type="radio"` draws a single one.
 *
 * Built on native radios sharing one `name`, so the browser supplies the
 * radiogroup keyboard pattern: the group is one Tab stop, and the arrow keys
 * move the choice between options.
 *
 * Usable declaratively (`[value]` + `(valueChange)`) or as a form control
 * (`[(ngModel)]`, `[formControl]`).
 */
@Component({
  selector: 'lz-radio-group',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Icon],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
  ],
  host: {
    class: 'lz-radio-group-host',
  },
})
export class RadioGroup implements ControlValueAccessor {
  readonly options = input<readonly LzRadioOption[]>([]);
  /** The chosen option's value; null when none is chosen. */
  readonly value = input<unknown>(null);
  /** The radios' shared `name`. Generated when not given. */
  readonly name = input<string | undefined>(undefined);
  /** The group's accessible name, when no visible heading names it. */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Id of a visible heading that names the group. */
  readonly ariaLabelledBy = input<string | undefined>(undefined);
  readonly appearance = input<LzRadioGroupAppearance>('plain');
  readonly orientation = input<LzRadioGroupOrientation>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Emitted with the chosen option's value. */
  readonly valueChange = output<unknown>();

  protected readonly groupId = `lz-radio-group-${nextRadioGroupId++}`;
  protected readonly groupName = computed(() => this.name() || this.groupId);

  /**
   * The rendered choice. Seeds from `value` and re-seeds when it changes, but
   * stays writable, so `writeValue()` and the user can both drive it.
   */
  protected readonly selected = linkedSignal(() => this.value());

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: unknown) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected isChecked(option: LzRadioOption): boolean {
    return option.value === this.selected();
  }

  protected isDisabled(option: LzRadioOption): boolean {
    return this.effectiveDisabled() || !!option.disabled;
  }

  protected descriptionId(index: number): string {
    return `${this.groupId}-description-${index}`;
  }

  protected choose(option: LzRadioOption): void {
    if (this.isDisabled(option) || this.isChecked(option)) return;
    this.selected.set(option.value);
    this.valueChange.emit(option.value);
    this.onChange(option.value);
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.selected.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
