/** Select component size options. */
export const LZ_SELECT_SIZES = ['sm', 'md'] as const;

export type LzSelectSize = (typeof LZ_SELECT_SIZES)[number];

/** Select option interface (matches publikator). */
export interface LzSelectOption {
  id: number;
  title: string;
  date: string;
  value?: string | number | boolean | null;
}

/** Select option type - can be string or SelectOption object (matches publikator). */
export type LzSelectOptionType = string | LzSelectOption;
