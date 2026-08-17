/** Select component size options. */
export const LZ_SELECT_SIZES = ['sm', 'md'] as const;

export type LzSelectSize = (typeof LZ_SELECT_SIZES)[number];

/** Select option — `label`/`value` for generic selects; `title`/`date`/`id` remain for publikator. */
export interface LzSelectOption {
  id?: number | string;
  title?: string;
  date?: string;
  label?: string;
  value?: string | number | boolean | null;
}

/** Select option type - can be string or SelectOption object (matches publikator). */
export type LzSelectOptionType = string | LzSelectOption;

export function lzSelectOptionLabel(option: LzSelectOptionType): string {
  if (typeof option === 'string') {
    return option;
  }
  return option.label ?? option.title ?? (option.value == null ? '' : String(option.value));
}

export function lzSelectOptionDate(option: LzSelectOptionType): string | null {
  return typeof option === 'string' ? null : (option.date ?? null);
}
