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

/** Icon style hint (consumed by future `lz-icon`; stored for API parity). */
export type LzButtonIconVariant = 'outline' | 'solid' | 'mini' | 'micro';
