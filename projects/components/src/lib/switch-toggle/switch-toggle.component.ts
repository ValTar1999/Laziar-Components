import {
  booleanAttribute,
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
import { NgClass } from '@angular/common';
import { LzSwitchToggleSize } from './switch-toggle.types';

/**
 * Switch Toggle `@laziar/components`.
 * Styles follow the Laziar System reference (Figma Switch/Toggle).
 *
 * Usable declaratively (`[active]` + `(changed)`) or as a form control
 * (`[formControl]` / `formControlName`).
 *
 * **Behaviour note.** Interaction now updates the component own state, so the
 * control responds even if the parent ignores the output - matching a native
 * input. Previously it was fully controlled and would snap back. A *change* to
 * the input still wins and re-seeds the state.
 */
@Component({
  selector: 'lz-switch-toggle',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [NgClass],
  templateUrl: './switch-toggle.component.html',
  styleUrl: './switch-toggle.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchToggle),
      multi: true,
    },
  ],
  host: {
    class: 'lz-switch-toggle-host',
  },
})
export class SwitchToggle implements ControlValueAccessor {
  /** Whether the switch is in active/on state. */
  readonly active = input(false, { transform: booleanAttribute });
  /** Whether the switch is disabled. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Switch size - affects dimensions. */
  readonly size = input<LzSwitchToggleSize>('md');

  /** Emitted when switch state changes. */
  readonly changed = output<boolean>();

  /**
   * The rendered state. Seeds from the `active` input and re-seeds whenever it
   * changes, but stays writable so `writeValue()` and user interaction can
   * drive it — which is what lets one component serve both usage styles.
   */
  protected readonly activeState = linkedSignal(() => this.active());

  /** Disabled via a form control, kept apart from the `disabled` input. */
  private readonly cvaDisabled = signal(false);

  /** Either source disables the control; neither clobbers the other. */
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  /** CSS classes for the container wrapper. */
  protected readonly containerClasses = computed(() => ({
    'lz-switch-toggle__container': true,
    [`lz-switch-toggle__container--${this.size()}`]: true,
    'lz-switch-toggle__container--disabled': this.effectiveDisabled(),
  }));

  /** Track classes — on stays `#121212` even when disabled (row fades via opacity). */
  protected readonly toggleClasses = computed(() => {
    const active = this.activeState();
    const disabled = this.effectiveDisabled();

    return {
      'lz-switch-toggle__toggle': true,
      [`lz-switch-toggle__toggle--${this.size()}`]: true,
      'lz-switch-toggle__toggle--inactive': !active,
      'lz-switch-toggle__toggle--active': active,
      'lz-switch-toggle__toggle--hoverable': !active && !disabled,
    };
  });

  /** Thumb classes — white knob; position follows the active state. */
  protected readonly circleClasses = computed(() => {
    const active = this.activeState();
    const size = this.size();

    return {
      'lz-switch-toggle__circle': true,
      [`lz-switch-toggle__circle--${size}`]: true,
      [`lz-switch-toggle__circle--${active ? 'right' : 'left'}`]: true,
    };
  });

  /** Toggle the switch state. */
  protected toggle(): void {
    if (this.effectiveDisabled()) return;

    const next = !this.activeState();
    this.activeState.set(next);
    this.changed.emit(next);
    this.onChange(next);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.activeState.set(!!value);
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
