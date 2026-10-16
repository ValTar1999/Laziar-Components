import { DocsComponentMeta } from '../../core/component-doc.model';

export const LIVE_EVENT_CARD_COMPONENT_META: DocsComponentMeta = {
  name: 'LiveEventCard',
  selector: 'lz-live-event-card',
  description: 'Live coverage card with publisher avatar, title, and timed entries.',
  controls: [
    { name: 'publisher', kind: 'string', default: 'Laziar Sport' },
    { name: 'eventTitle', kind: 'string', default: 'Cupa Moldovei' },
    { name: 'size', kind: 'select', options: ['sm', 'md'], default: 'sm' },
    { name: 'showActions', kind: 'boolean', default: true },
    { name: 'showBottomBorder', kind: 'boolean', default: false },
  ],
  variants: [
    { label: 'sm', props: { publisher: 'Laziar Sport', eventTitle: 'Cupa Moldovei', size: 'sm' } },
    { label: 'md', props: { publisher: 'Laziar Sport', eventTitle: 'Cupa Moldovei', size: 'md' } },
  ],
  inputs: [
    { name: 'publisher', type: 'string', default: `''`, description: 'Publisher name' },
    { name: 'avatarFirstName', type: 'string', default: `''`, description: 'Avatar first name' },
    { name: 'avatarLastName', type: 'string', default: `''`, description: 'Avatar last name' },
    {
      name: 'avatarImgUrl',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Avatar image; empty shows initials',
    },
    { name: 'eventTitle', type: 'string', default: `''`, description: 'Event headline' },
    {
      name: 'entries',
      type: 'LzLiveEventCardEntry[]',
      default: '[]',
      description: 'Timed coverage lines',
    },
    { name: 'link', type: 'string', default: `'#'`, description: 'Title href' },
    { name: 'size', type: `'sm' | 'md'`, default: `'sm'`, description: 'Card size' },
    {
      name: 'showActions',
      type: 'boolean',
      default: 'false',
      description: 'Watch-later / save buttons',
    },
    {
      name: 'showBottomBorder',
      type: 'boolean',
      default: 'false',
      description: 'Bottom separator',
    },
    {
      name: 'watchLaterLabel',
      type: 'string',
      default: `'Watch later'`,
      description: 'Tooltip when watch-later is off; override to localize',
    },
    {
      name: 'removeWatchLaterLabel',
      type: 'string',
      default: `'Remove from Watch later'`,
      description: 'Tooltip when watch-later is on; override to localize',
    },
    {
      name: 'saveToListLabel',
      type: 'string',
      default: `'Save to list'`,
      description: 'Tooltip when save-to-list is off; override to localize',
    },
    {
      name: 'removeFromListLabel',
      type: 'string',
      default: `'Remove from list'`,
      description: 'Tooltip when save-to-list is on; override to localize',
    },
  ],
  outputs: [
    { name: 'open', type: 'OutputEmitterRef<string>', description: 'Title click (link)' },
    { name: 'publisherClick', type: 'OutputEmitterRef<string>', description: 'Publisher click' },
    { name: 'watchLaterToggle', type: 'OutputEmitterRef<void>', description: 'Watch later' },
    { name: 'saveToListToggle', type: 'OutputEmitterRef<void>', description: 'Save to list' },
  ],
  slots: [],
  examples: [
    {
      title: 'Live blog',
      code: `<lz-live-event-card
  publisher="Laziar Sport"
  avatarFirstName="Live"
  avatarLastName="Desk"
  eventTitle="Cupa Moldovei"
  [entries]="[{ time: '12:01', text: 'Kick-off' }]"
  [showActions]="true"
/>`,
    },
  ],
  tokens: [{ name: '--lz-color-primary', description: 'Live accent' }],
};
