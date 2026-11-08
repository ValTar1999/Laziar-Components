import { DocsComponentMeta } from '../../core/component-doc.model';

export const TABLE_COMPONENT_META: DocsComponentMeta = {
  name: 'Table',
  selector: 'lz-table',
  description:
    'Data table from publikator: sticky columns, row hover, pagination, page-size menu (Floating UI), and empty state.',
  controls: [
    { name: 'showPagination', kind: 'boolean', default: true },
    { name: 'showShadow', kind: 'boolean', default: true },
    { name: 'empty', kind: 'boolean', default: false },
    { name: 'emptyMessage', kind: 'string', default: 'Nu există articole' },
  ],
  snippetIgnore: ['empty'],
  variants: [
    { label: 'paginated · sticky actions', props: { showPagination: true, showShadow: true } },
    { label: 'plain', props: { showPagination: false, showShadow: false } },
    {
      label: 'empty',
      props: { empty: true, showPagination: false, emptyMessage: 'Nu există articole' },
    },
  ],
  inputs: [
    {
      name: 'columns',
      type: 'readonly TableColumn[]',
      default: '[]',
      description: 'Column defs (minWidth/width like publikator Tailwind classes)',
    },
    { name: 'data', type: 'readonly TableRow[]', default: '[]', description: 'Row objects' },
    {
      name: 'showPagination',
      type: 'boolean',
      default: 'false',
      description: 'Range + page size + pager',
    },
    { name: 'currentPage', type: 'number', default: '1', description: 'Active page' },
    { name: 'pageSize', type: 'number', default: '10', description: 'Rows per page' },
    { name: 'totalItems', type: 'number', default: '0', description: 'Total count for the pager' },
    {
      name: 'emptyMessage',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Empty-state heading',
    },
    { name: 'showShadow', type: 'boolean', default: 'true', description: 'Container shadow' },
    {
      name: 'rowClickable',
      type: 'boolean',
      default: 'false',
      description:
        'Row hover + click. Clicks on a button, link or field inside the row stay with that control',
    },
    {
      name: 'rowFocusable',
      type: 'boolean',
      default: 'true',
      description:
        'Interactive rows are Tab stops (role link). Off: a pointer-only shortcut, for rows whose action the keyboard reaches inside the row',
    },
    {
      name: 'rowKey',
      type: 'string | ((row: T) => unknown) | null',
      default: 'null',
      description:
        'Field or function identifying a row, so cell components follow their row across a re-sort (default: tracked by position)',
    },
    {
      name: 'sortKey',
      type: 'string | null',
      default: 'null',
      description: 'The sortable column the rows are sorted by; sets aria-sort and the arrow',
    },
    {
      name: 'sortDirection',
      type: `'asc' | 'desc'`,
      default: `'asc'`,
      description: 'Direction of sortKey',
    },
  ],
  outputs: [
    { name: 'pageChange', type: 'OutputEmitterRef<number>', description: 'Page index' },
    { name: 'pageSizeChange', type: 'OutputEmitterRef<number>', description: 'Page size' },
    { name: 'rowClick', type: 'OutputEmitterRef<T>', description: 'Row click (the row as given)' },
    {
      name: 'sortChange',
      type: 'OutputEmitterRef<TableSort>',
      description:
        'A sortable header was clicked: same column flips, another starts ascending. The table never reorders data itself',
    },
  ],
  slots: [
    { name: 'cellTemplate', description: 'Custom cell (`row`, `column`, `value`)' },
    { name: 'headerTemplate', description: 'Custom header' },
    { name: 'rowDetailTemplate', description: 'Expandable row body' },
  ],
  examples: [
    {
      title: 'Sortable columns',
      code: `<!-- columns: [{ key: 'name', header: 'Name', sortable: true },
              { key: 'actions', header: 'Actions', hideHeader: true }] -->
<lz-table
  [columns]="columns"
  [data]="sortedRows()"
  rowKey="id"
  [sortKey]="sort().key"
  [sortDirection]="sort().direction"
  (sortChange)="sort.set($event)"
/>`,
    },
    {
      title: 'Publikator news list',
      code: `<lz-table
  [columns]="columns"
  [data]="rows"
  [rowClickable]="true"
  [showPagination]="true"
  [currentPage]="page"
  [pageSize]="10"
  [totalItems]="total"
  (pageChange)="load($event)"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-font-sans', description: 'Onest for headers, cells, and pager' },
    { name: '--lz-shadow-sticky', description: 'Sticky column edge' },
  ],
};
