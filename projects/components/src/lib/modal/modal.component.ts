import { A11yModule } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { Icon } from '../icon/icon.component';
import { LzModalCloseReason, LzModalSize } from './modal.types';

let nextModalId = 0;

/** Body class applied while any modal is open. Defined in styles/theme.css. */
const SCROLL_LOCK_CLASS = 'lz-modal-scroll-lock';

/**
 * Modals can legitimately stack (a confirm over a form), so the lock is
 * reference-counted at module scope: the first open acquires it, the last
 * close releases it. A per-instance flag would let an inner modal closing
 * unlock the page while an outer one is still open.
 */
let scrollLockCount = 0;

/**
 * Dialog `@laziar/components`.
 *
 * Declarative: the host owns the open state and passes it in, so the modal
 * composes with signals and `@if` instead of an imperative open() registry.
 *
 * Content projects into three optional slots:
 * `[lz-modal-header]`, `[lz-modal-body]`, `[lz-modal-footer]`.
 *
 * Positioning note: the backdrop is `position: fixed` rendered inline rather
 * than through a CDK overlay, so an ancestor in the host app with `transform`,
 * `filter` or `contain` becomes its containing block and will clip it.
 */
@Component({
  selector: 'lz-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule, Icon],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    class: 'lz-modal-host',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ModalComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  /** Whether the modal is rendered. The host owns this state. */
  readonly open = input(false, { transform: booleanAttribute });
  readonly size = input<LzModalSize>('md');
  /** Accessible dialog title. Also rendered when no header slot is projected. */
  readonly title = input<string | undefined>(undefined);
  /**
   * Accessible name when a `[lz-modal-header]` slot replaces `title`.
   * Without one, a projected header leaves the dialog unnamed.
   */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Show the header's dismiss button. */
  readonly dismissible = input(true, { transform: booleanAttribute });
  /** Accessible label for the dismiss button — an input so it can be localized. */
  readonly closeButtonLabel = input('Close dialog');
  /** Close when the backdrop is clicked. */
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  /** Close when Escape is pressed. */
  readonly closeOnEscape = input(true, { transform: booleanAttribute });

  readonly closed = output<LzModalCloseReason>();

  protected readonly labelId = `lz-modal-${nextModalId++}`;

  /** Whether this instance currently holds a share of the scroll lock. */
  private holdsScrollLock = false;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.acquireScrollLock();
        return;
      }
      this.releaseScrollLock();
    });
  }

  ngOnDestroy(): void {
    // A modal destroyed while open must not leave the page unscrollable.
    this.releaseScrollLock();
  }

  protected requestClose(reason: LzModalCloseReason): void {
    this.closed.emit(reason);
  }

  protected onBackdropPointerDown(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) return;
    // Only a press that both starts and ends on the backdrop dismisses, so a
    // drag that began inside the panel does not close it.
    if (event.target !== event.currentTarget) return;
    this.requestClose('backdrop');
  }

  /**
   * Document-level so Escape works wherever focus sits — including the
   * backdrop, which is presentational and deliberately not focusable.
   */
  protected onEscape(): void {
    if (!this.open() || !this.closeOnEscape()) return;
    this.requestClose('escape');
  }

  private acquireScrollLock(): void {
    if (this.holdsScrollLock) return;
    this.holdsScrollLock = true;
    scrollLockCount++;
    this.document.body.classList.add(SCROLL_LOCK_CLASS);
  }

  private releaseScrollLock(): void {
    if (!this.holdsScrollLock) return;
    this.holdsScrollLock = false;
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      this.document.body.classList.remove(SCROLL_LOCK_CLASS);
    }
  }
}
