export type TablePaginationItem = number | 'ellipsis';

export interface TableColumn {
  key: string;
  header: string;
  /**
   * CSS size (`12rem`, `92px`) or a Tailwind width class from publikator
   * (`min-w-[92px]`, `min-w-12`, `w-40`).
   */
  minWidth?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  stickyPosition?: 'left' | 'right';
  headerClass?: string;
  cellClass?: string;
  /**
   * Rendered as `aria-sort` on the header cell. ARIA only allows it on a
   * columnheader, so a `headerTemplate` cannot set it from inside the cell.
   * Not needed on a `sortable` column: the table sets it from `sortKey`.
   */
  ariaSort?: 'ascending' | 'descending' | 'none';
  /**
   * The header becomes a button that asks for this column to be sorted
   * (`sortChange`) and shows which way it is. The table never reorders `data`
   * itself: the rows may be sorted on a server, or by rules only the app knows.
   */
  sortable?: boolean;
  /**
   * Keeps `header` for screen readers but hides it on screen, for a column whose
   * cells say what it is (an actions column, say) and would otherwise be unnamed.
   */
  hideHeader?: boolean;
}

export type TableRow = Record<string, unknown>;

/** Which way a column is sorted. */
export const LZ_TABLE_SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type TableSortDirection = (typeof LZ_TABLE_SORT_DIRECTIONS)[number];

/** The column the rows are sorted by, and which way. */
export interface TableSort {
  key: string;
  direction: TableSortDirection;
}

/**
 * The sort a header click asks for: the column already sorted flips direction,
 * any other becomes the sort column, ascending.
 */
export function lzTableNextSort(current: TableSort | null, key: string): TableSort {
  if (current?.key === key) {
    return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
  }
  return { key, direction: 'asc' };
}

/** Parse publikator Tailwind width utilities into CSS lengths. */
export function lzTableUtilityToCss(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const arbitrary = trimmed.match(/^(?:min-w|max-w|w)-\[(.+)\]$/);
  if (arbitrary) {
    return arbitrary[1];
  }

  const scale = trimmed.match(/^(?:min-w|max-w|w)-(\d+(?:\.\d+)?)$/);
  if (scale) {
    return `${Number(scale[1]) * 0.25}rem`;
  }

  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}
