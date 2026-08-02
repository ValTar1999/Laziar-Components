/** Visual / color variants for `lz-badge`. */
export const LZ_BADGE_COLORS = [
  'green',
  'red',
  'purple',
  'yellow',
  'blue',
  'orange',
  'magenta',
  /** Alias for `magenta` (publikator / frontend typo). */
  'magrnta',
  'teal',
  'gray',
  'violet',
] as const;

export type LzBadgeColor = (typeof LZ_BADGE_COLORS)[number];

/** Size scale for badge components. */
export const LZ_BADGE_SIZES = ['lg', 'md', 'sm'] as const;

export type LzBadgeSize = (typeof LZ_BADGE_SIZES)[number];

/** Icon position relative to badge content. */
export type LzBadgeIconPosition = 'left' | 'right';

/** Icon style hint for future `lz-icon` integration. */
export type LzBadgeIconVariant = 'outline' | 'solid' | 'mini' | 'micro';
