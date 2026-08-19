export const LZ_CARD_VARIANTS = ['col', 'row', 'grid'] as const;
export type LzCardVariant = (typeof LZ_CARD_VARIANTS)[number];

export const LZ_CARD_SIZES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
export type LzCardSize = (typeof LZ_CARD_SIZES)[number];

/** Frontend article-card sizes (`sm`–`xl`). `xxs` / `xs` map onto `sm` typography. */
export const LZ_CARD_ARTICLE_SIZES = ['sm', 'md', 'lg', 'xl'] as const;
export type LzCardArticleSize = (typeof LZ_CARD_ARTICLE_SIZES)[number];

export const LZ_CARD_ROW_IMAGE_HEIGHT_MODES = ['full', 'fixed'] as const;
export type LzCardRowImageHeightMode = (typeof LZ_CARD_ROW_IMAGE_HEIGHT_MODES)[number];

export const LZ_CARD_ROW_IDENTITY_POSITIONS = ['top', 'bottom'] as const;
export type LzCardRowIdentityPosition = (typeof LZ_CARD_ROW_IDENTITY_POSITIONS)[number];

export const LZ_CARD_ROW_META_LAYOUTS = ['split', 'inline'] as const;
export type LzCardRowMetaLayout = (typeof LZ_CARD_ROW_META_LAYOUTS)[number];

export const LZ_CARD_ROW_IMAGE_ASPECTS = ['default', '3/2', '1/1'] as const;
export type LzCardRowImageAspect = (typeof LZ_CARD_ROW_IMAGE_ASPECTS)[number];

export const LZ_CARD_ROW_SUBTITLE_LAYOUTS = ['beside', 'below'] as const;
export type LzCardRowSubtitleLayout = (typeof LZ_CARD_ROW_SUBTITLE_LAYOUTS)[number];
