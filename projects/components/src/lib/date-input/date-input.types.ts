/** Field heights, as lz-select: sm 32px, md 40px. */
export const LZ_DATE_INPUT_SIZES = ['sm', 'md'] as const;

export type LzDateInputSize = (typeof LZ_DATE_INPUT_SIZES)[number];
