import type { Placement } from '@floating-ui/dom';

/** How the floating panel is taken out of normal flow. */
export type LzFloatingStrategy = 'absolute' | 'fixed';

/**
 * Shared positioning options for `[lzFloating]` and `attachLzFloating`.
 *
 * Covers the frontend popover copies (`fixed` + `offset` + `flip` + `shift`)
 * and the publikator `[appFloating]` extras (`matchWidth`, `offsetTop`, flip off).
 */
export interface LzFloatingOptions {
  /** Preferred side. Floating UI may flip it when `flip` is on. */
  placement?: Placement;
  /** Gap on the main axis, in px. */
  offset?: number;
  /**
   * Main-axis gap after the placement resolves to `top*`.
   * When omitted, a flipped panel uses `min(offset, 12)` so a large bottom gap
   * does not leave the menu floating far above the anchor.
   */
  offsetTop?: number;
  strategy?: LzFloatingStrategy;
  /** Stretch the panel to the anchor width. */
  matchWidth?: boolean;
  /**
   * `true` — min-width equals the anchor.
   * A number — min-width is at least that many pixels and at least the anchor width.
   */
  minWidth?: number | true;
  /**
   * Cap the panel height to this value, and also to the space left in the viewport.
   * Same `size` middleware the select and dropdown lists use.
   */
  maxHeight?: number;
  /** Viewport padding for the `size` middleware. Omit it to leave `size` unpadded. */
  sizePadding?: number;
  /** Fall back to the opposite side when there is no room. */
  flip?: boolean;
  /** Padding passed to `flip()`. Omit it for an unpadded flip. */
  flipPadding?: number;
  /** Minimum distance from the viewport edge, in px. */
  shiftPadding?: number;
  /**
   * Round `left`/`top` to whole pixels. Default `true` (frontend menus).
   * Select, dropdown, and language-dropdown pass `false` to keep subpixel coordinates.
   */
  round?: boolean;
  /**
   * Keep the panel `visibility: hidden` until the first coordinates are applied.
   * Template directive turns this on so `*ngIf` does not flash the panel at 0,0.
   */
  hideUntilPositioned?: boolean;
}
