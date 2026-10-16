import { LzBadgeColor } from '../badge/badge.types';

/** `underline-text` — like `underline`, but the indicator matches the active label's text width. */
export type LzTabsStyle = 'outline' | 'underline' | 'underline-text' | 'border';

export type LzTabsSize = 'sm' | 'md' | 'lg';

export type LzDisabledTabTooltipTrigger = 'hover' | 'click';

export interface LzTabBadge {
  text?: string;
  variant?: LzBadgeColor;
}
