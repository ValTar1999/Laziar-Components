import { DocsComponentMeta } from '../../core/component-doc.model';

export const PAGE_HEADER_COMPONENT_META: DocsComponentMeta = {
  name: 'Page Header',
  selector: 'lz-page-header',
  description:
    'Top of a page: an <h1> title with an optional subtitle, actions on the right, optional tabs underneath and one full-width line under it all.',
  controls: [
    { name: 'heading', kind: 'string', default: 'Conținut Video' },
    { name: 'subtitle', kind: 'string', default: 'Videoclipuri și playlisturi' },
    {
      name: 'showAddon',
      kind: 'boolean',
      default: true,
      description: 'Demo: a count beside the title',
    },
    { name: 'showActions', kind: 'boolean', default: true, description: 'Demo: an action button' },
    { name: 'showTabs', kind: 'boolean', default: true, description: 'Demo: underline tabs' },
  ],
  snippetIgnore: ['showAddon', 'showActions', 'showTabs'],
  variants: [
    {
      label: 'title only',
      props: {
        heading: 'Setări',
        subtitle: '',
        showAddon: false,
        showActions: false,
        showTabs: false,
      },
    },
    {
      label: 'title · actions',
      props: {
        heading: 'Știri',
        subtitle: '',
        showAddon: false,
        showActions: true,
        showTabs: false,
      },
    },
    {
      label: 'full',
      props: {
        heading: 'Conținut Video',
        subtitle: 'Videoclipuri și playlisturi',
        showAddon: true,
        showActions: true,
        showTabs: true,
      },
    },
  ],
  inputs: [
    {
      name: 'heading',
      type: 'string',
      default: `''`,
      description: 'Page title, rendered as the <h1>; no <h1> without it',
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
    {
      name: '[lzPageHeaderTabs]',
      description: 'Tabs under the title; their underline sits on the header line',
    },
  ],
  examples: [
    {
      title: 'With actions and tabs',
      code: `<lz-page-header heading="Conținut Video">
  <lz-button lzPageHeaderActions label="Creează" size="sm" pill />
  <lz-tabs lzPageHeaderTabs [tabs]="tabs" style="underline" />
</lz-page-header>`,
    },
    {
      title: 'A count beside the title',
      code: `<lz-page-header heading="Short-uri">
  <span lzPageHeaderTitleAddon>12 / 40</span>
</lz-page-header>`,
    },
  ],
  tokens: [
    { name: '--lz-page-header-title-size', description: 'Title font size (1.875rem)' },
    { name: '--lz-page-header-title-line-height', description: 'Title line height (2rem)' },
    { name: '--lz-page-header-title-tracking', description: 'Title letter spacing (-1.12px)' },
    { name: '--lz-color-border-subtle', description: 'Line under the header' },
  ],
};
