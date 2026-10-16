import {
  AfterViewInit,
  booleanAttribute,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import { attachLzFloating } from './floating';
import type { LzFloatingStrategy } from './floating.types';

type LzFloatingAnchor = HTMLElement | ElementRef<HTMLElement> | null | undefined;

/**
 * Positions the host against an anchor with Floating UI.
 *
 * Replaces publikator `[appFloating]` and the copied `computePosition` blocks
 * in frontend (follow/more menus, sidebar popovers, get-app popup).
 *
 * ```html
 * <button #anchor type="button">Open</button>
 * <div
 *   lzFloating
 *   [lzFloating]="anchor"
 *   lzFloatingPlacement="bottom-end"
 *   [lzFloatingOffset]="10"
 *   [lzFloatingShiftPadding]="12"
 * >
 *   Menu
 * </div>
 * ```
 *
 * The directive writes `position`, `left` and `top` on the host. Do not also
 * bind those styles. For a CDK overlay element that is not in the template,
 * call `attachLzFloating` instead.
 */
@Directive({
  selector: '[lzFloating]',
  standalone: true,
})
export class LzFloating implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly viewReady = signal(false);
  private stopAuto: (() => void) | null = null;
  private frameOuter = 0;
  private frameInner = 0;

  /** Anchor element, or an `ElementRef` to one. */
  readonly anchor = input<LzFloatingAnchor>(null, { alias: 'lzFloating' });
  readonly placement = input<Placement>('bottom', { alias: 'lzFloatingPlacement' });
  readonly offset = input(4, { alias: 'lzFloatingOffset', transform: numberAttribute });
  /** Bound as a number. Omit it to use the flipped-top cap inside `attachLzFloating`. */
  readonly offsetTop = input<number | undefined>(undefined, { alias: 'lzFloatingOffsetTop' });
  readonly strategy = input<LzFloatingStrategy>('fixed', { alias: 'lzFloatingStrategy' });
  readonly matchWidth = input(false, {
    alias: 'lzFloatingMatchWidth',
    transform: booleanAttribute,
  });
  readonly flip = input(true, { alias: 'lzFloatingFlip', transform: booleanAttribute });
  readonly shiftPadding = input(8, {
    alias: 'lzFloatingShiftPadding',
    transform: numberAttribute,
  });

  constructor() {
    effect(() => {
      this.anchor();
      this.placement();
      this.offset();
      this.offsetTop();
      this.strategy();
      this.matchWidth();
      this.flip();
      this.shiftPadding();
      if (!this.viewReady()) return;
      this.scheduleUpdate();
    });

    inject(DestroyRef).onDestroy(() => this.teardown());
  }

  ngAfterViewInit(): void {
    const floating = this.host.nativeElement;
    Object.assign(floating.style, {
      position: this.strategy(),
      left: '0px',
      top: '0px',
      visibility: 'hidden',
    });
    this.viewReady.set(true);
  }

  private scheduleUpdate(): void {
    cancelAnimationFrame(this.frameOuter);
    cancelAnimationFrame(this.frameInner);
    // Two frames: after *ngIf, layout (fonts, editor) is stable enough to measure.
    this.frameOuter = requestAnimationFrame(() => {
      this.frameInner = requestAnimationFrame(() => this.updatePosition());
    });
  }

  private updatePosition(): void {
    this.stopAuto?.();
    this.stopAuto = null;

    const reference = resolveAnchor(this.anchor());
    const floating = this.host.nativeElement;
    if (!reference) {
      floating.style.visibility = 'hidden';
      return;
    }

    this.stopAuto = attachLzFloating(reference, floating, {
      placement: this.placement(),
      offset: this.offset(),
      offsetTop: this.offsetTop(),
      strategy: this.strategy(),
      matchWidth: this.matchWidth(),
      flip: this.flip(),
      shiftPadding: this.shiftPadding(),
      hideUntilPositioned: true,
    });
  }

  private teardown(): void {
    cancelAnimationFrame(this.frameOuter);
    cancelAnimationFrame(this.frameInner);
    this.stopAuto?.();
    this.stopAuto = null;
  }
}

function resolveAnchor(anchor: LzFloatingAnchor): HTMLElement | null {
  if (!anchor || typeof anchor === 'string') return null;
  return anchor instanceof ElementRef ? anchor.nativeElement : anchor;
}
