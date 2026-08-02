export type LzTooltipPosition =
  'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type LzTooltipTheme = 'dark' | 'light';

export type LzTooltipTrigger = 'hover' | 'click';

/** @deprecated Use {@link LzTooltipPosition} */
export type LzTooltipHoverPosition = LzTooltipPosition;
/** @deprecated Use {@link LzTooltipTheme} */
export type LzTooltipHoverTheme = LzTooltipTheme;
/** @deprecated Use {@link LzTooltipTrigger} */
export type LzTooltipHoverTrigger = LzTooltipTrigger;
