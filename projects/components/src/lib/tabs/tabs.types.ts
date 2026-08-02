import { LzBadgeColor } from '../badge/badge.types';

export type LzTabsStyle = 'outline' | 'underline' | 'border';

export type LzTabsSize = 'sm' | 'md' | 'lg';

export type LzDisabledTabTooltipTrigger = 'hover' | 'click';

export interface LzTabBadge {
  text?: string;
  variant?: LzBadgeColor;
}
