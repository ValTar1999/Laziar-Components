import { booleanAttribute, Component, computed, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { CommonModule } from '@angular/common';

/**
 * Button group `@laziar/components`.
 * Стили — эталон Laziar System (Figma Button Group / Playground).
 */
@Component({
  selector: 'lz-button-group',
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [CommonModule],
  host: {
    class: 'lz-button-group-host',
  },
})
export class ButtonGroup {
  /** Shows divider lines between buttons (frontend / publikator `line`). */
  readonly line = input(false, { transform: booleanAttribute });
  /** @deprecated Prefer `line`. Alias kept for Laziar callers. */
  readonly divided = input(false, { transform: booleanAttribute });

  protected readonly containerClass = computed<string>(() => {
    const classes = ['lz-button-group'];

    if (this.line() || this.divided()) {
      classes.push('lz-button-group--divided');
    }

    return classes.join(' ');
  });
}
