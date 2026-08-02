export type TablePaginationItem = number | 'ellipsis';

export interface TableColumn {
  key: string;
  header: string;
  /** Tailwind / utility class string (publikator), e.g. `min-w-[12rem]`. */
  minWidth?: string;
  /** Tailwind / utility class string (publikator), e.g. `w-40`. */
  width?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  stickyPosition?: 'left' | 'right';
  /** Consumer-defined class applied to the header cell. */
  headerClass?: string;
  /** Consumer-defined class applied to each body cell. */
  cellClass?: string;
}

export type TableRow = Record<string, unknown>;
