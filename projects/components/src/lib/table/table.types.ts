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
}

export type TableRow = Record<string, unknown>;

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
