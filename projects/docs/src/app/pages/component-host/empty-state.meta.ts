import { DocsComponentMeta } from '../../core/component-doc.model';

export const EMPTY_STATE_COMPONENT_META: DocsComponentMeta = {
  name: 'EmptyState',
  selector: 'lz-empty-state',
  description:
    'A "nothing here yet" block: an icon in a gray circle, a title, a muted description and an optional small button.',
  controls: [
    { name: 'heading', kind: 'string', default: 'No campaigns yet' },
    { name: 'description', kind: 'string', default: 'Create the first one to see it here.' },
    { name: 'icon', kind: 'string', default: 'inbox' },
    { name: 'actionLabel', kind: 'string', default: 'Create campaign' },
    { name: 'actionIcon', kind: 'string', default: 'plus' },
    { name: 'fullPage', kind: 'boolean', default: false },
  ],
  variants: [
    {
      label: 'with action',
      props: {
        heading: 'No campaigns yet',
        description: 'Create the first one to see it here.',
        actionLabel: 'Create campaign',
      },
    },
    {
      label: 'text only',
      props: {
        heading: 'Nothing found',
        description: 'Try another search.',
        icon: 'magnifying-glass',
      },
    },
  ],
  inputs: [
    { name: 'heading', type: 'string', default: `''`, description: 'Title' },
    {
      name: 'description',
      type: 'string',
      default: `''`,
      description: 'Muted text under the title',
    },
    { name: 'icon', type: 'string', default: `'inbox'`, description: 'Icon in the circle' },
    {
      name: 'iconType',
      type: 'LzIconVariant',
      default: `'outline'`,
      description: 'Icon sprite: outline, solid, mini, micro or custom',
    },
    {
      name: 'actionLabel',
      type: 'string',
      default: `''`,
      description: 'Button label; there is no button without it',
    },
    {
      name: 'actionIcon',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Icon on the left of the button label',
    },
    {
      name: 'fullPage',
      type: 'boolean',
      default: 'false',
      description:
        'Places the block where an empty page shows it (128px from the top) instead of 40px above and below',
    },
  ],
  outputs: [
    { name: 'action', type: 'OutputEmitterRef<void>', description: 'The button was clicked' },
  ],
  slots: [],
  examples: [
    {
      title: 'Empty list with an action',
      code: `<lz-empty-state
  heading="No campaigns yet"
  description="Create the first one to see it here."
  actionLabel="Create campaign"
  actionIcon="plus"
  (action)="create()"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-50', description: 'Icon circle' },
    { name: '--lz-color-text-secondary', description: 'Description text' },
  ],
};
