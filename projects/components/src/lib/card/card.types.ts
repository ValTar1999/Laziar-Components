export const LZ_CARD_VARIANTS = ['col', 'row', 'grid'] as const;
export type LzCardVariant = (typeof LZ_CARD_VARIANTS)[number];

export const LZ_CARD_SIZES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
export type LzCardSize = (typeof LZ_CARD_SIZES)[number];
