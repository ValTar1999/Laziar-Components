import { DocsComponentMeta } from '../../core/component-doc.model';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['solid', 'bg', 'line'] as const;

export const TAB_BUTTON_COMPONENT_META: DocsComponentMeta = {
  name: 'TabButton',
  selector: 'lz-tab-button',
  description:
    'Single tab button: solid/bg (fill) and line (underline) variants. solid is an alias for bg.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Overview',
    },
    {
      name: 'active',
      kind: 'boolean',
      default: true,
    },
    {
      name: 'size',
      kind: 'select',
      options: [...sizes],
      default: 'md',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...variants],
      default: 'bg',
      description: 'solid and bg are equivalent',
    },
  ],
  variants: [
    { label: 'bg · active', props: { label: 'Overview', active: true, size: 'md', variant: 'bg' } },
    { label: 'bg · idle', props: { label: 'Members', active: false, size: 'md', variant: 'bg' } },
    {
      label: 'line · active',
      props: { label: 'Overview', active: true, size: 'md', variant: 'line' },
    },
    {
      label: 'solid · active',
      props: { label: 'Overview', active: true, size: 'md', variant: 'solid' },
    },
    { label: 'bg · sm', props: { label: 'Small', active: true, size: 'sm', variant: 'bg' } },
    { label: 'line · lg', props: { label: 'Large', active: true, size: 'lg', variant: 'line' } },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: `'Tab'`,
      description: 'Button text',
    },
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      description: 'Active state',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Size',
    },
    {
      name: 'variant',
      type: `'solid' | 'bg' | 'line'`,
      default: `'bg'`,
      description: 'solid → bg; line — underline indicator',
    },
    {
      name: 'link',
      type: 'string | undefined',
      default: 'undefined',
      description: 'If set, renders routerLink instead of a button',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Tab group',
      code: `<nav class="tabs">
  <lz-tab-button label="Overview" [active]="true" variant="bg" />
  <lz-tab-button label="Members" variant="bg" />
  <lz-tab-button label="Settings" variant="bg" />
</nav>`,
    },
    {
      title: 'With routerLink',
      code: `<lz-tab-button label="Profile" link="/profile" [active]="true" variant="line" />`,
    },
  ],
  tokens: [
    {
      name: '--lz-color-neutral-900',
      description: 'Active bg/solid fill and variant=line indicator',
    },
    { name: '--lz-color-text-inverse', description: 'Text on the active pill' },
    { name: '--lz-color-neutral-50', description: 'Hover background' },
    { name: '--lz-radius-full', description: 'bg/solid variant pill' },
  ],
};
