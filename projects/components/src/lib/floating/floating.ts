import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
  type Placement,
} from '@floating-ui/dom';
import type { LzFloatingOptions, LzFloatingStrategy } from './floating.types';

const DEFAULT_OFFSET = 4;
const DEFAULT_SHIFT_PADDING = 8;
const FLIPPED_TOP_OFFSET_CAP = 12;

/**
 * Position `floating` against `reference` and keep it updated on scroll and resize.
 * Returns a cleanup function.
 *
 * Coordinates are rounded unless `round: false`. Position is applied after the
 * first measurement, unless `hideUntilPositioned` parks the panel at 0,0 first.
 */
export function attachLzFloating(
  reference: HTMLElement,
  floating: HTMLElement,
  options: LzFloatingOptions = {},
): () => void {
  const strategy: LzFloatingStrategy = options.strategy ?? 'fixed';
  const placement: Placement = options.placement ?? 'bottom';
  const gap = options.offset ?? DEFAULT_OFFSET;
  const shiftPadding = options.shiftPadding ?? DEFAULT_SHIFT_PADDING;
  const allowFlip = options.flip ?? true;
  const hideUntilPositioned = options.hideUntilPositioned ?? false;
  const round = options.round !== false;
  const limitSize =
    options.matchWidth === true || options.minWidth != null || options.maxHeight != null;

  if (hideUntilPositioned) {
    Object.assign(floating.style, {
      position: strategy,
      visibility: 'hidden',
      left: '0px',
      top: '0px',
    });
  }

  const middleware = [
    offset((state) => {
      const isTop = state.placement.startsWith('top');
      const mainAxis = isTop ? (options.offsetTop ?? Math.min(gap, FLIPPED_TOP_OFFSET_CAP)) : gap;
      return { mainAxis, crossAxis: 0 };
    }),
    ...(allowFlip
      ? [options.flipPadding != null ? flip({ padding: options.flipPadding }) : flip()]
      : []),
    shift({ padding: shiftPadding }),
  ];

  if (limitSize) {
    middleware.push(
      size({
        ...(options.sizePadding != null ? { padding: options.sizePadding } : {}),
        apply({ rects, availableHeight, elements }) {
          const style: Partial<CSSStyleDeclaration> = {};
          if (options.matchWidth) {
            style.width = `${rects.reference.width}px`;
          }
          if (options.minWidth != null) {
            const floor = options.minWidth === true ? 0 : options.minWidth;
            style.minWidth = `${Math.max(floor, rects.reference.width)}px`;
          }
          if (options.maxHeight != null) {
            style.maxHeight = `${Math.min(options.maxHeight, Math.max(0, availableHeight))}px`;
          }
          Object.assign(elements.floating.style, style);
        },
      }),
    );
  }

  const update = (): void => {
    void computePosition(reference, floating, {
      placement,
      strategy,
      middleware,
    }).then(({ x, y }) => {
      const left = round ? Math.round(x) : x;
      const top = round ? Math.round(y) : y;
      Object.assign(floating.style, {
        position: strategy,
        left: `${left}px`,
        top: `${top}px`,
        ...(hideUntilPositioned ? { visibility: 'visible' } : {}),
      });
    });
  };

  update();
  return autoUpdate(reference, floating, update);
}
