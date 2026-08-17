/** Visual / color variants for `lz-badge`. */
export const LZ_BADGE_COLORS = [
  'green',
  'red',
  'purple',
  'yellow',
  'blue',
  'orange',
  'magenta',
  'teal',
  'gray',
  'violet',
] as const;

export type LzBadgeColor = (typeof LZ_BADGE_COLORS)[number] | 'magrnta';

/** Size scale for badge components. */
export const LZ_BADGE_SIZES = ['lg', 'md', 'sm'] as const;

export type LzBadgeSize = (typeof LZ_BADGE_SIZES)[number];

/** Fill style from Laziar System Badges: pastel, solid fill, or outline. */
export const LZ_BADGE_VARIANTS = ['subtle', 'solid', 'outline'] as const;

export type LzBadgeVariant = (typeof LZ_BADGE_VARIANTS)[number];

/** Icon position relative to badge content. */
export type LzBadgeIconPosition = 'left' | 'right';

/** Icon style hint for future `lz-icon` integration. */
export type LzBadgeIconVariant = 'outline' | 'solid' | 'mini' | 'micro';
