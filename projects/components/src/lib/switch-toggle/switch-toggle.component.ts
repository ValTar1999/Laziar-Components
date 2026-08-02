import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { LzSwitchToggleSize } from './switch-toggle.types';

/**
 * Switch Toggle `@laziar/components`.
 * API/стили — эталон publikator + frontend (`app-switch-toggle`).
 */
@Component({
  selector: 'lz-switch-toggle',
  standalone: true,
  imports: [NgClass],
  templateUrl: './switch-toggle.component.html',
  styleUrl: './switch-toggle.component.scss',
  host: {
    class: 'lz-switch-toggle-host',
  },
})
export class SwitchToggle {
  /** Whether the switch is in active/on state. */
  readonly active = input(false, { transform: booleanAttribute });
  /** Whether the switch is disabled. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Switch size - affects dimensions. */
  readonly size = input<LzSwitchToggleSize>('md');

  /** Emitted when switch state changes. */
  readonly changed = output<boolean>();

  /** CSS classes for the container wrapper. */
  protected readonly containerClasses = computed(() => ({
    'lz-switch-toggle__container': true,
    [`lz-switch-toggle__container--${this.size()}`]: true,
    'lz-switch-toggle__container--disabled': this.disabled(),
  }));

  /**
   * Track classes — publikator: disabled || !active → bg-gray-50, else bg-gray-900.
   * Hover gray-100 only when !active && !disabled.
   */
  protected readonly toggleClasses = computed(() => {
    const active = this.active();
    const disabled = this.disabled();

    return {
      'lz-switch-toggle__toggle': true,
      [`lz-switch-toggle__toggle--${this.size()}`]: true,
      'lz-switch-toggle__toggle--inactive': disabled || !active,
      'lz-switch-toggle__toggle--active': !disabled && active,
      'lz-switch-toggle__toggle--hoverable': !active && !disabled,
    };
  });

  /** Thumb classes — publikator circleBackground + translatePosition. */
  protected readonly circleClasses = computed(() => {
    const active = this.active();
    const disabled = this.disabled();
    const size = this.size();

    return {
      'lz-switch-toggle__circle': true,
      [`lz-switch-toggle__circle--${size}`]: true,
      'lz-switch-toggle__circle--disabled': disabled,
      'lz-switch-toggle__circle--active': !disabled && active,
      'lz-switch-toggle__circle--inactive': !disabled && !active,
      [`lz-switch-toggle__circle--${active ? 'right' : 'left'}`]: true,
    };
  });

  /** Toggle the switch state. */
  protected toggle(): void {
    if (!this.disabled()) {
      this.changed.emit(!this.active());
    }
  }
}
