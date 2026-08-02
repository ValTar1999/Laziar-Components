/** A labeled group of selectable dropdown items. */
export interface LzDropdownSection {
  heading: string;
  items: string[];
}

/** Visual scale for a dropdown trigger. */
export const LZ_DROPDOWN_SIZES = ['xl', 'lg', 'md', 'sm'] as const;

export type LzDropdownSize = (typeof LZ_DROPDOWN_SIZES)[number];
