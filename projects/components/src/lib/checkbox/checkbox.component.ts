import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { LzCheckboxType, LzCheckboxVariant } from './checkbox.types';

/**
 * Checkbox/Radio `@laziar/components`.
 * Стили — эталон Laziar System (Figma Checkbox/Radio).
 */
@Component({
  selector: 'lz-checkbox',
  standalone: true,
  imports: [NgClass],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  host: {
    class: 'lz-checkbox-host',
  },
})
export class Checkbox {
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
    classes['lz-checkbox__wrapper--disabled'] = this.disabled();

    return classes;
  });

  /** CSS classes for the input element. */
  protected readonly inputClasses = computed(() => {
    const variant = this.variant();
    const classes: Record<string, boolean> = {};

    classes['lz-checkbox__input'] = true;
    classes['lz-checkbox__input--rounded'] = this.isRounded();
    classes['lz-checkbox__input--disabled'] = this.disabled();
    classes[`lz-checkbox__input--${variant}`] = true;

    return classes;
  });

  /** CSS classes for the label content. */
  protected readonly labelClasses = computed(() => {
    const classes: Record<string, boolean> = {};

    classes['lz-checkbox__label'] = true;
    classes['lz-checkbox__label--disabled'] = this.disabled();

    return classes;
  });

  /** Handle input change events. */
  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
