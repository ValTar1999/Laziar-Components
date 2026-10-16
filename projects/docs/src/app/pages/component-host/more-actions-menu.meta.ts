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
    {
      name: 'watchLaterLabel',
      type: 'string',
      default: `'Watch later'`,
      description: 'Row label when watch-later is off; override to localize',
    },
    {
      name: 'removeWatchLaterLabel',
      type: 'string',
      default: `'Remove from Watch later'`,
      description: 'Row label when watch-later is on; override to localize',
    },
    {
      name: 'saveToListLabel',
      type: 'string',
      default: `'Save to list'`,
      description: 'Row label when save-to-list is off; override to localize',
    },
    {
      name: 'removeFromListLabel',
      type: 'string',
      default: `'Remove from list'`,
      description: 'Row label when save-to-list is on; override to localize',
    },
    {
      name: 'publisherFollowLabel',
      type: 'string',
      default: `'Follow publisher'`,
      description: 'Row label when publisher is not followed; override to localize',
    },
    {
      name: 'unfollowPublisherLabel',
      type: 'string',
      default: `'Unfollow publisher'`,
      description: 'Row label when publisher is followed; override to localize',
    },
    {
      name: 'authorFollowLabel',
      type: 'string',
      default: `'Follow author'`,
      description: 'Row label when author is not followed; override to localize',
    },
    {
      name: 'unfollowAuthorLabel',
      type: 'string',
      default: `'Unfollow author'`,
      description: 'Row label when author is followed; override to localize',
    },
    {
      name: 'shareLabel',
      type: 'string',
      default: `'Share'`,
      description: 'Share row label; override to localize',
    },
    {
      name: 'copyLinkLabel',
      type: 'string',
      default: `'Copy link...'`,
      description: 'Copy-link row label; override to localize',
    },
    {
      name: 'reportLabel',
      type: 'string',
      default: `'Report'`,
      description: 'Report row label; override to localize',
    },
    {
      name: 'comingSoonLabel',
      type: 'string',
      default: `'Coming soon'`,
      description: 'Tooltip for rows disabled pending launch; override to localize',
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
