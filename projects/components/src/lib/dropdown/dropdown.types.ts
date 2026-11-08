/** Visual tone of a menu item. `danger` marks a destructive action (delete, remove). */
export const LZ_DROPDOWN_ITEM_TONES = ['default', 'danger'] as const;

export type LzDropdownItemTone = (typeof LZ_DROPDOWN_ITEM_TONES)[number];

/**
 * A menu item with more than a label. A plain string is still accepted
 * anywhere an item is, and behaves exactly as before.
 */
export interface LzDropdownItem {
  /** Text shown in the menu. */
  label: string;
  /** What `itemSelected` emits for this item. Defaults to `label`. */
  value?: string;
  /** Leading `lz-icon` name (outline sprite). */
  icon?: string;
  /** `danger` colours the item as a destructive action. */
  tone?: LzDropdownItemTone;
  /** Shown but not selectable, and skipped by keyboard focus. */
  disabled?: boolean;
  /**
   * Marks the current choice in a pick-one list (e.g. the active organization).
   * Any defined value makes the item a `menuitemradio`; `true` adds a check
   * mark and `aria-checked="true"`. Leave it undefined for plain actions.
   */
  selected?: boolean;
}

/** One entry in a section: a plain label or a full item. */
export type LzDropdownEntry = string | LzDropdownItem;

/** A labeled group of selectable dropdown items. */
export interface LzDropdownSection {
  /** Group caption; an empty string renders no caption. */
  heading: string;
  items: LzDropdownEntry[];
}

/** Visual scale for a dropdown trigger. */
export const LZ_DROPDOWN_SIZES = ['xl', 'lg', 'md', 'sm'] as const;

export type LzDropdownSize = (typeof LZ_DROPDOWN_SIZES)[number];

/**
 * Where the menu opens relative to the trigger. `bottom-end` lines the menu up
 * with the trigger's right edge, for a row-actions button at the end of a table
 * row. The menu still flips and shifts to stay inside the viewport.
 */
export const LZ_DROPDOWN_PLACEMENTS = [
  'bottom-start',
  'bottom-end',
  'top-start',
  'top-end',
] as const;

export type LzDropdownPlacement = (typeof LZ_DROPDOWN_PLACEMENTS)[number];
