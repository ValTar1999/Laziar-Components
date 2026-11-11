import { DocsComponentMeta } from '../../core/component-doc.model';

export const NAV_ITEM_COMPONENT_META: DocsComponentMeta = {
  name: 'NavItem',
  selector: 'a[lz-nav-item], button[lz-nav-item]',
  description:
    'One entry of a side navigation menu. Put it on the link or button that navigates, so router links stay links; the label is the projected content.',
  controls: [
    {
      name: 'icon',
      kind: 'select',
      options: ['', 'squares-2x2', 'megaphone', 'credit-card', 'building-office-2'],
      default: 'megaphone',
    },
    {
      name: 'active',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: [
    { label: 'idle', props: { icon: 'megaphone', active: false } },
    { label: 'active', props: { icon: 'megaphone', active: true } },
    { label: 'no icon', props: { icon: '', active: false } },
  ],
  inputs: [
    {
      name: 'icon',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Heroicons outline name drawn before the label',
    },
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      description:
        'Draws the entry as the current one. aria-current="page" (routerLinkActive with ariaCurrentWhenActive) draws the same way',
    },
  ],
  outputs: [],
  slots: [{ name: 'default', description: 'The label' }],
  examples: [
    {
      title: 'With the router',
      code: `<nav aria-label="Main">
  <a lz-nav-item routerLink="/dashboard" icon="squares-2x2"
     routerLinkActive ariaCurrentWhenActive="page">Dashboard</a>
  <a lz-nav-item routerLink="/campaigns" icon="megaphone"
     routerLinkActive ariaCurrentWhenActive="page">Campaigns</a>
</nav>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-50', description: 'Fill of the active and hovered entry' },
    { name: '--lz-color-text-secondary', description: 'Idle label and icon' },
    { name: '--lz-color-text-primary', description: 'Active and hovered label and icon' },
  ],
};
