import { A11yModule } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  untracked,
} from '@angular/core';
import { Icon } from '../icon/icon.component';
import { LzModalCloseReason, LzModalSize, LzModalTone, LzModalVariant } from './modal.types';

let nextModalId = 0;

/** Body class applied while any modal is open. Defined in styles/theme.css. */
const SCROLL_LOCK_CLASS = 'lz-modal-scroll-lock';

/**
 * Fallback for the leave animation in case `animationend` never fires
 * (element hidden, animations stripped by the host). Matches the 300ms
 * sheet timing in frontend's bottom-sheet-animation.ts, plus slack.
 */
const LEAVE_FALLBACK_MS = 350;

/**
 * Open modals, innermost last. Modals legitimately stack (a confirm over a
 * form), so both the scroll lock and Escape go through this: the page unlocks
 * only when the last one closes, and Escape dismisses only the top one.
 */
const openStack: ModalComponent[] = [];

/** `undefined` stays `undefined` so the variant can pick the default. */
function optionalBoolean(value: unknown): boolean | undefined {
  return value == null ? undefined : booleanAttribute(value);
}

/**
 * Dialog `@laziar/components` — the one modal for publikator and frontend.
 *
 * Declarative: the host owns the open state and passes it in, so the modal
 * composes with signals and `@if` instead of an imperative open() registry.
 *
 * - `variant="default"`: titled header, scrolling body, footer
 *   (publikator `app-modal-layout`).
 * - `variant="confirm"`: icon tile, title and description at the top of the
 *   body, no dividers (publikator `app-confirm-dialog`, frontend membership
 *   modals).
 * - Below 768px it becomes a bottom sheet unless `sheetOnMobile` is false.
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

  /** Whether the modal is shown. The host owns this state. */
  readonly open = input(false, { transform: booleanAttribute });
  readonly size = input<LzModalSize>('md');
  readonly variant = input<LzModalVariant>('default');
  /** Accessible dialog title. Rendered in the header, or in the body for `confirm`. */
  readonly title = input<string | undefined>(undefined);
  /** Supporting text under the title; also the dialog's accessible description. */
  readonly description = input<string | undefined>(undefined);
  /** Icon in the tile above a `confirm` title, e.g. `x-circle`, `exclamation-triangle`. */
  readonly icon = input<string | undefined>(undefined);
  readonly tone = input<LzModalTone>('danger');
  /**
   * Accessible name when a `[lz-modal-header]` slot replaces `title`.
   * Without one, a projected header leaves the dialog unnamed.
   */
  readonly ariaLabel = input<string | undefined>(undefined);
  /**
   * Header/footer dividers. Defaults to on for `default`, off for `confirm`.
   * A confirm header holds only the close button, so there it drives the footer
   * divider alone (publikator's archive dialog keeps one above its actions).
   */
  readonly dividers = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  });
  /** Slide up from the bottom edge below 768px, as frontend's sheets do. */
  readonly sheetOnMobile = input(true, { transform: booleanAttribute });
  /**
   * A request is in flight: every way of closing is blocked and the dismiss
   * button is disabled, so the result is not lost behind a closed dialog.
   */
  readonly busy = input(false, { transform: booleanAttribute });
  /**
   * `false` makes the dialog a required step (publikator publisher selector):
   * no close button, and backdrop and Escape are ignored too.
   */
  readonly dismissible = input(true, { transform: booleanAttribute });
  /** Accessible label for the dismiss button — an input so it can be localized. */
  readonly closeButtonLabel = input('Close dialog');
  /** Close when the backdrop is clicked. */
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  /** Close when Escape is pressed. */
  readonly closeOnEscape = input(true, { transform: booleanAttribute });

  readonly closed = output<LzModalCloseReason>();

  protected readonly labelId = `lz-modal-${nextModalId++}`;
  protected readonly descriptionId = `${this.labelId}-description`;

  protected readonly isConfirm = computed(() => this.variant() === 'confirm');
  protected readonly showDividers = computed(() => this.dividers() ?? !this.isConfirm());

  /** Stays true through the leave animation after `open` turns false. */
  protected readonly rendered = signal(false);
  protected readonly leaving = signal(false);

  private leaveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.clearLeaveTimer();
        this.leaving.set(false);
        this.rendered.set(true);
        this.pushToStack();
        return;
      }
      // Release immediately: the page is usable again while the panel fades out.
      this.removeFromStack();
      if (untracked(this.rendered)) this.startLeave();
    });
  }

  ngOnDestroy(): void {
    this.clearLeaveTimer();
    // A modal destroyed while open must not leave the page unscrollable.
    this.removeFromStack();
  }

  protected requestClose(reason: LzModalCloseReason): void {
    if (this.busy() || !this.dismissible()) return;
    this.closed.emit(reason);
  }

  protected onBackdropPointerDown(event: MouseEvent): void {
    if (!this.closeOnBackdrop() || this.leaving()) return;
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
    if (openStack[openStack.length - 1] !== this) return;
    this.requestClose('escape');
  }

  protected onPanelAnimationEnd(event: AnimationEvent): void {
    if (event.target !== event.currentTarget || !this.leaving()) return;
    this.finishLeave();
  }

  private startLeave(): void {
    this.leaving.set(true);
    this.clearLeaveTimer();
    this.leaveTimer = setTimeout(() => this.finishLeave(), LEAVE_FALLBACK_MS);
  }

  private finishLeave(): void {
    this.clearLeaveTimer();
    this.leaving.set(false);
    this.rendered.set(false);
  }

  private clearLeaveTimer(): void {
    if (this.leaveTimer === null) return;
    clearTimeout(this.leaveTimer);
    this.leaveTimer = null;
  }

  private pushToStack(): void {
    if (openStack.includes(this)) return;
    openStack.push(this);
    this.document.body.classList.add(SCROLL_LOCK_CLASS);
  }

  private removeFromStack(): void {
    const index = openStack.indexOf(this);
    if (index === -1) return;
    openStack.splice(index, 1);
    if (openStack.length === 0) {
      this.document.body.classList.remove(SCROLL_LOCK_CLASS);
    }
  }
}
