/** A rendered pagination slot: a page number, or a gap between ranges. */
export type LzPaginationItem = number | 'ellipsis';

/** Pagination control size. */
export const LZ_PAGINATION_SIZES = ['sm', 'md'] as const;

export type LzPaginationSize = (typeof LZ_PAGINATION_SIZES)[number];
