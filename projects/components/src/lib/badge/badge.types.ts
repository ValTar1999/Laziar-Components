/** Visual / color variants for `lz-badge`. */
export const LZ_BADGE_COLORS = [
  'black',
  'white',
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

/** Size scale (Figma Badge): sm — 28px (pill 24px), xs — 20px. */
export const LZ_BADGE_SIZES = ['sm', 'xs'] as const;

/** @deprecated `lg` and `md` render as `sm`. */
export type LzBadgeLegacySize = 'lg' | 'md';

export type LzBadgeSize = (typeof LZ_BADGE_SIZES)[number] | LzBadgeLegacySize;

/** Fill: subtle — Figma Badge (pastel); solid / outline — extras outside Figma. */
export const LZ_BADGE_VARIANTS = ['subtle', 'solid', 'outline'] as const;

export type LzBadgeVariant = (typeof LZ_BADGE_VARIANTS)[number];

/** Icon position relative to badge content. */
export type LzBadgeIconPosition = 'left' | 'right';

/** Icon style hint for future `lz-icon` integration. */
export type LzBadgeIconVariant = 'outline' | 'solid' | 'mini' | 'micro';
