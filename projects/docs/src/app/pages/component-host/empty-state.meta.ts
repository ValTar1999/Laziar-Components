import { DocsComponentMeta } from '../../core/component-doc.model';

export const EMPTY_STATE_COMPONENT_META: DocsComponentMeta = {
  name: 'Empty State',
  selector: 'lz-empty-state',
  description:
    '"Nothing here yet" block: a gray circle with an icon, a title, a muted description and an optional small button.',
  controls: [
    { name: 'icon', kind: 'string', default: 'play-circle', description: 'lz-icon symbol name' },
    {
      name: 'iconType',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro'],
      default: 'outline',
    },
    { name: 'heading', kind: 'string', default: 'Nu ai încă videoclipuri' },
    { name: 'headingLevel', kind: 'number', default: 2 },
    {
      name: 'description',
      kind: 'string',
      default: 'Încarcă primul tău videoclip ca să apară aici.',
    },
    { name: 'actionLabel', kind: 'string', default: 'Încarcă' },
    { name: 'actionIcon', kind: 'string', default: 'plus' },
    { name: 'fullPage', kind: 'boolean', default: false },
  ],
  variants: [
    {
      label: 'section · with action',
      props: {
        icon: 'play-circle',
        heading: 'Nu ai încă videoclipuri',
        description: 'Încarcă primul tău videoclip ca să apară aici.',
        actionLabel: 'Încarcă',
        actionIcon: 'plus',
      },
    },
    {
      label: 'section · text only',
      props: {
        icon: 'magnifying-glass',
        heading: 'Niciun rezultat',
        description: 'Încearcă alt termen.',
        actionLabel: '',
      },
    },
  ],
  inputs: [
    { name: 'icon', type: 'string', default: `'inbox'`, description: 'Icon in the circle' },
    { name: 'iconType', type: 'LzIconVariant', default: `'outline'`, description: 'Icon set' },
    { name: 'heading', type: 'string', default: `''`, description: 'Title' },
    {
      name: 'headingLevel',
      type: 'number',
      default: '2',
      description: 'Heading level screen readers announce the title at; the look stays the same',
    },
    {
      name: 'description',
      type: 'string',
      default: `''`,
      description: 'Muted text under the title',
    },
    {
      name: 'actionLabel',
      type: 'string',
      default: `''`,
      description: 'Button label; no button without it',
    },
    {
      name: 'actionIcon',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Icon left of the button label',
    },
    {
      name: 'fullPage',
      type: 'boolean',
      default: 'false',
      description: '128px from the top, as on an empty page; otherwise 40px above and below',
    },
  ],
  outputs: [{ name: 'action', type: 'OutputEmitterRef<void>', description: 'Button click' }],
  slots: [],
  examples: [
    {
      title: 'Empty page',
      code: `<lz-empty-state
  fullPage
  icon="play-circle"
  heading="Nu ai încă videoclipuri"
  description="Încarcă primul tău videoclip ca să apară aici."
  actionLabel="Încarcă"
  actionIcon="plus"
  (action)="upload()"
/>`,
    },
  ],
  tokens: [
    {
      name: '--lz-empty-state-full-page-offset',
      description: 'Space above a full-page state (--lz-space-32)',
    },
    { name: '--lz-empty-state-description-max-width', description: 'Description width (24rem)' },
  ],
};
