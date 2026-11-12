import { DocsComponentMeta } from '../../core/component-doc.model';

export const PAGE_HEADER_COMPONENT_META: DocsComponentMeta = {
  name: 'PageHeader',
  selector: 'lz-page-header',
  description:
    'The top of a page: the title as the page h1, an optional subtitle, actions on the right, optional tabs underneath and a full-width line under it all.',
  controls: [
    { name: 'heading', kind: 'string', default: 'Video content' },
    { name: 'subtitle', kind: 'string', default: 'Everything published on the channel' },
    { name: 'showAddon', label: 'title addon', kind: 'boolean', default: true },
    { name: 'showActions', label: 'actions', kind: 'boolean', default: true },
    { name: 'showTabs', label: 'tabs', kind: 'boolean', default: true },
  ],
  snippetIgnore: ['showAddon', 'showActions', 'showTabs'],
  variants: [
    {
      label: 'title only',
      props: { heading: 'Video content', showAddon: false, showActions: false, showTabs: false },
    },
    {
      label: 'with subtitle and actions',
      props: {
        heading: 'Video content',
        subtitle: 'Everything published on the channel',
        showAddon: false,
        showActions: true,
        showTabs: false,
      },
    },
  ],
  inputs: [
    {
      name: 'heading',
      type: 'string',
      default: `''`,
      description: 'Page title, rendered as the h1',
    },
    {
      name: 'subtitle',
      type: 'string',
      default: `''`,
      description: 'Optional line under the title',
    },
  ],
  outputs: [],
  slots: [
    { name: '[lzPageHeaderTitleAddon]', description: 'Beside the title: a count, a status badge' },
    { name: '[lzPageHeaderActions]', description: 'Buttons on the right' },
    { name: '[lzPageHeaderTabs]', description: 'Tabs under the title row' },
  ],
  examples: [
    {
      title: 'Title, action and tabs',
      code: `<lz-page-header heading="Video content">
  <lz-badge lzPageHeaderTitleAddon size="xs">12</lz-badge>
  <lz-button lzPageHeaderActions label="Create" size="sm" pill />
  <lz-tabs lzPageHeaderTabs [tabs]="tabs" [style]="'underline'" />
</lz-page-header>`,
    },
  ],
  tokens: [
    { name: '--lz-font-serif', description: 'Title' },
    { name: '--lz-color-border-subtle', description: 'Line under the header' },
  ],
};
