import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { NgClass } from '@angular/common';
import { LzCheckboxType, LzCheckboxVariant } from './checkbox.types';

/**
 * Checkbox/Radio `@laziar/components`.
 * Styles follow the Laziar System reference (Figma Checkbox/Radio).
 *
 * Usable declaratively (`[checked]` + `(checkedChange)`) or as a form control
 * (`[formControl]` / `formControlName`).
 *
 * **Behaviour note.** Interaction now updates the component own state, so the
 * control responds even if the parent ignores the output - matching a native
 * input. Previously it was fully controlled and would snap back. A *change* to
 * the input still wins and re-seeds the state.
 *
 * `type="radio"` is a **visual** style only. A radio *group* needs a shared
 * name and a value per option, which a boolean accessor cannot express — use
 * the dedicated radio component for grouped selection.
 */
@Component({
  selector: 'lz-checkbox',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [NgClass],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
  host: {
    class: 'lz-checkbox-host',
  },
})
export class Checkbox implements ControlValueAccessor {
  /** Input type - checkbox or radio. */
  readonly type = input<LzCheckboxType>('checkbox');
  /** Whether input should be rounded (for radio style). */
  readonly rounded = input(false, { transform: booleanAttribute });
  /** Whether checkbox is checked. */
  readonly checked = input(false, { transform: booleanAttribute });
  /** Whether checkbox is disabled. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Whether checkbox is in indeterminate state (checkbox only). */
  readonly indeterminate = input(false, { transform: booleanAttribute });
  /** Visual variant for validation states. */
  readonly variant = input<LzCheckboxVariant>('default');
  /** Title/label text for the checkbox. */
  readonly title = input<string>('');
  /** Description text below the title. */
  readonly description = input<string>('');

  /** Emitted when checked state changes. */
  readonly checkedChange = output<boolean>();

  /**
   * The rendered state. Seeds from the `checked` input and re-seeds whenever it
   * changes, but stays writable so `writeValue()` and user interaction can
   * drive it — which is what lets one component serve both usage styles.
   */
  protected readonly checkedState = linkedSignal(() => this.checked());

  /** Disabled via a form control, kept apart from the `disabled` input. */
  private readonly cvaDisabled = signal(false);

  /** Either source disables the control; neither clobbers the other. */
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  /** Reference to the input element. */
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  constructor() {
    // Keep native indeterminate in sync whenever inputs change (not only once after render).
    effect(() => {
      const indeterminate = this.indeterminate();
      const type = this.type();
      const inputElement = this.inputRef()?.nativeElement;

      if (type === 'checkbox' && inputElement) {
        inputElement.indeterminate = indeterminate;
      }
    });
  }

  /** Radio is always circular; `rounded` still forces the pill control on checkbox. */
  protected readonly isRounded = computed(() => this.rounded() || this.type() === 'radio');

  /** CSS classes for the wrapper element. */
  protected readonly wrapperClasses = computed(() => {
    const classes: Record<string, boolean> = {};

    classes['lz-checkbox__wrapper'] = true;
    classes['lz-checkbox__wrapper--rounded'] = this.isRounded();
    classes['lz-checkbox__wrapper--disabled'] = this.effectiveDisabled();

    return classes;
  });

  /** CSS classes for the input element. */
  protected readonly inputClasses = computed(() => {
    const variant = this.variant();
    const classes: Record<string, boolean> = {};

    classes['lz-checkbox__input'] = true;
    classes['lz-checkbox__input--rounded'] = this.isRounded();
    classes['lz-checkbox__input--disabled'] = this.effectiveDisabled();
    classes[`lz-checkbox__input--${variant}`] = true;

    return classes;
  });

  /** CSS classes for the label content. */
  protected readonly labelClasses = computed(() => {
    const classes: Record<string, boolean> = {};

    classes['lz-checkbox__label'] = true;
    classes['lz-checkbox__label--disabled'] = this.effectiveDisabled();

    return classes;
  });

  /** Handle input change events. */
  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedState.set(input.checked);
    this.checkedChange.emit(input.checked);
    this.onChange(input.checked);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checkedState.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
