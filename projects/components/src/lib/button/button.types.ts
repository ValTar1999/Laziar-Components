/** Visual / behavioral variants for `lz-button`. */
export const LZ_BUTTON_VARIANTS = [
  'primary',
  'outline',
  'secondary',
  'tertiary',
  'link',
  'iconOnly',
] as const;

export type LzButtonVariant = (typeof LZ_BUTTON_VARIANTS)[number];

/** Size scale (publikator padding as canonical). */
export const LZ_BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type LzButtonSize = (typeof LZ_BUTTON_SIZES)[number];

/** Palette tone mapped onto semantic design tokens. */
export const LZ_BUTTON_COLORS = ['gray', 'red', 'yellow', 'green', 'blue', 'purple'] as const;

export type LzButtonColor = (typeof LZ_BUTTON_COLORS)[number];

export type LzButtonType = 'button' | 'submit' | 'reset';

/** @deprecated Prefer {@link LzButtonIconPosition}. */
export type LzButtonIconDirection = 'left' | 'right';

export type LzButtonIconPosition = 'left' | 'right';

/**
 * Horizontal placement of the icon + label inside the button. Only visible when
 * the button is wider than its content (`fullWidth`, or a sized host), e.g. a
 * stack of sidebar navigation entries that must share a left edge.
 */
export const LZ_BUTTON_ALIGNS = ['center', 'start', 'end'] as const;

export type LzButtonAlign = (typeof LZ_BUTTON_ALIGNS)[number];

/** Icon style passed to `lz-icon` `type`. */
export type LzButtonIconVariant = 'outline' | 'solid' | 'mini' | 'micro';
