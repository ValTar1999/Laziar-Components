import { DocsComponentMeta } from '../../core/component-doc.model';

export const MORE_ACTIONS_MENU_COMPONENT_META: DocsComponentMeta = {
  name: 'MoreActionsMenu',
  selector: 'lz-more-actions-menu',
  description: 'Kebab menu for share, copy link, watch later, follow, and report.',
  controls: [
    { name: 'layout', kind: 'select', options: ['desktop', 'mobile'], default: 'desktop' },
    { name: 'showSavedActions', kind: 'boolean', default: true },
    { name: 'disableSaveToList', kind: 'boolean', default: false },
    { name: 'disableReport', kind: 'boolean', default: false },
  ],
  variants: [
    {
      label: 'desktop',
      props: { layout: 'desktop', disableSaveToList: false, disableReport: false },
    },
    {
      label: 'mobile',
      props: { layout: 'mobile', disableSaveToList: false, disableReport: false },
    },
  ],
  inputs: [
    {
      name: 'layout',
      type: `'desktop' | 'mobile'`,
      default: `'desktop'`,
      description: 'Menu layout',
    },
    {
      name: 'showSavedActions',
      type: 'boolean',
      default: 'true',
      description: 'Watch later / save rows',
    },
    {
      name: 'disableSaveToList',
      type: 'boolean',
      default: 'true',
      description: 'Hide save-to-list',
    },
    { name: 'disableReport', type: 'boolean', default: 'true', description: 'Hide report' },
    {
      name: 'disablePublisherFollow',
      type: 'boolean',
      default: 'true',
      description: 'Hide follow publisher',
    },
    {
      name: 'disableAuthorFollow',
      type: 'boolean',
      default: 'true',
      description: 'Hide follow author',
    },
  ],
  outputs: [
    { name: 'share', type: 'OutputEmitterRef<void>', description: 'Share' },
    { name: 'copyLink', type: 'OutputEmitterRef<void>', description: 'Copy link' },
    { name: 'watchLater', type: 'OutputEmitterRef<void>', description: 'Watch later' },
    { name: 'saveToList', type: 'OutputEmitterRef<void>', description: 'Save to list' },
    { name: 'report', type: 'OutputEmitterRef<void>', description: 'Report' },
  ],
  slots: [],
  examples: [
    {
      title: 'Article toolbar',
      code: `<lz-more-actions-menu [disableSaveToList]="false" [disableReport]="false" />`,
    },
  ],
  tokens: [{ name: '--lz-shadow-dropdown', description: 'Menu shadow' }],
};
