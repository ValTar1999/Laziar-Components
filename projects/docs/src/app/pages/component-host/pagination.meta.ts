import { DocsComponentMeta } from '../../core/component-doc.model';

export const PAGINATION_COMPONENT_META: DocsComponentMeta = {
  name: 'Pagination',
  selector: 'lz-pagination',
  description:
    'Page numbers with previous and next arrows. It emits the page that was asked for; the host owns the current page and passes it back.',
  controls: [
    { name: 'totalPages', kind: 'number', default: 12 },
    { name: 'size', kind: 'select', options: ['sm', 'md'], default: 'md' },
    { name: 'disabled', kind: 'boolean', default: false },
    { name: 'hideOnSinglePage', kind: 'boolean', default: true },
  ],
  variants: [
    { label: 'md', props: { totalPages: 12, size: 'md' } },
    { label: 'sm', props: { totalPages: 12, size: 'sm' } },
    { label: 'few pages', props: { totalPages: 3, size: 'md' } },
    { label: 'disabled', props: { totalPages: 12, disabled: true } },
  ],
  inputs: [
    { name: 'page', type: 'number', default: '1', description: 'Current page, counted from 1' },
    { name: 'totalPages', type: 'number', default: '1', description: 'Number of pages' },
    { name: 'size', type: `'sm' | 'md'`, default: `'md'`, description: 'Size' },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables every button, e.g. while a page loads',
    },
    {
      name: 'hideOnSinglePage',
      type: 'boolean',
      default: 'true',
      description: 'Renders nothing when there is only one page',
    },
    {
      name: 'previousLabel',
      type: 'string',
      default: `'Previous'`,
      description: 'Accessible name of the previous arrow',
    },
    {
      name: 'nextLabel',
      type: 'string',
      default: `'Next'`,
      description: 'Accessible name of the next arrow',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: `'Pagination'`,
      description: 'Accessible name of the control',
    },
    {
      name: 'pageLabel',
      type: '(page: number) => string',
      default: '(page) => `Page ${page}`',
      description: 'Builds the accessible name of each page button, so it can be localized',
    },
  ],
  outputs: [
    {
      name: 'pageChange',
      type: 'OutputEmitterRef<number>',
      description: 'The page that was asked for',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'The host owns the page',
      code: `<lz-pagination
  [page]="page()"
  [totalPages]="totalPages()"
  [disabled]="loading()"
  (pageChange)="loadPage($event)"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900', description: 'Current page' },
    { name: '--lz-shadow-focus', description: 'Focus ring' },
  ],
};
