import { ChangeDetectorRef, DestroyRef, Directive, inject } from '@angular/core';

/**
 * @internal First-paint OnPush input flush. Attached via hostDirectives; do not use in apps.
 *
 * Signal inputs on the first CD can be committed after the view has already
 * been checked. `@if (input())` then stays false until a later event (click).
 *
 * `afterNextRender` is still too early. A macrotask CD on this component view
 * paints the bound inputs without a user gesture.
 */
@Directive({
  selector: '[lzInputFlush]',
  standalone: true,
})
export class LzInputFlush {
  constructor() {
    const cdr = inject(ChangeDetectorRef);
    const timeoutId = setTimeout(() => {
      cdr.markForCheck();
      cdr.detectChanges();
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(timeoutId));
  }
}
