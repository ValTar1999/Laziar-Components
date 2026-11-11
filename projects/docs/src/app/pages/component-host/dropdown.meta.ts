import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_DROPDOWN_PLACEMENTS, LZ_DROPDOWN_SIZES } from '@laziar/components';

export const DROPDOWN_COMPONENT_META: DocsComponentMeta = {
  name: 'DropdownComponent',
  selector: 'lz-dropdown',
  description:
    'Menu dropdown with a trigger button and sectioned items. Items are plain strings or objects with an icon, a danger tone, a disabled state or a current-choice check. Overlay via CDK + Floating UI.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Menu',
    },
    {
      name: 'sizeVariant',
      kind: 'select',
      options: [...LZ_DROPDOWN_SIZES],
      default: 'xl',
    },
    {
      name: 'icon',
      kind: 'string',
      default: '',
      description: 'Leading trigger icon; with an empty title the trigger is icon-only',
    },
    {
      name: 'placement',
      kind: 'select',
      options: [...LZ_DROPDOWN_PLACEMENTS],
      default: 'bottom-start',
    },
    {
      name: 'fullWidth',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: [
    { label: 'xl', props: { title: 'Menu', sizeVariant: 'xl' } },
    { label: 'lg', props: { title: 'Menu', sizeVariant: 'lg' } },
    { label: 'md', props: { title: 'Menu', sizeVariant: 'md' } },
    { label: 'sm', props: { title: 'Menu', sizeVariant: 'sm' } },
    {
      label: 'row actions · xs',
      props: { title: '', sizeVariant: 'xs', icon: 'ellipsis-horizontal', ariaLabel: 'Actions' },
    },
    {
      label: 'with icon',
      props: { title: 'Acme Media', sizeVariant: 'xl', icon: 'building-office-2' },
    },
    {
      label: 'icon only',
      props: { title: '', sizeVariant: 'md', icon: 'ellipsis-vertical', ariaLabel: 'Actions' },
    },
    { label: 'disabled', props: { title: 'Menu', sizeVariant: 'xl', disabled: true } },
  ],
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: `'Menu'`,
      description: 'Trigger label; empty with an icon gives an icon-only trigger',
    },
    {
      name: 'sections',
      type: 'LzDropdownSection[]',
      default: '[]',
      description:
        'Menu groups: heading + items. An item is a string or LzDropdownItem { label, value?, icon?, tone?, disabled?, selected? }',
    },
    {
      name: 'sizeVariant',
      type: `'xl' | 'lg' | 'md' | 'sm' | 'xs'`,
      default: `'xl'`,
      description: 'Trigger size; xs is the 24px icon-only button of a table row menu',
    },
    {
      name: 'icon',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Leading trigger icon (outline sprite)',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Accessible name of the trigger; required for an icon-only trigger',
    },
    {
      name: 'placement',
      type: `'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`,
      default: `'bottom-start'`,
      description: 'Menu position; bottom-end for a row-actions button at the end of a row',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Stretch the trigger to the host width',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the trigger',
    },
  ],
  outputs: [
    {
      name: 'itemSelected',
      type: 'OutputEmitterRef<string>',
      description: "Fires with the item's value (or its label for a plain string item)",
    },
    {
      name: 'opened',
      type: 'OutputEmitterRef<void>',
      description: 'Fires when the menu opens',
    },
    {
      name: 'close',
      type: 'OutputEmitterRef<void>',
      description: 'Fires when the menu closes',
    },
  ],
  slots: [
    {
      name: '[lzDropdownTrigger]',
      description:
        'Content drawn as the trigger in place of the title and chevron, e.g. an avatar. It sits inside the trigger button, so keep it non-interactive and give the dropdown an ariaLabel',
    },
  ],
  examples: [
    {
      title: 'Sectioned menu',
      code: `<lz-dropdown
  title="Menu"
  sizeVariant="md"
  [sections]="[
    { heading: 'Account', items: ['Profile', 'Settings'] },
    { heading: 'Actions', items: ['Archive', 'Delete'] }
  ]"
  (itemSelected)="onSelect($event)"
/>`,
    },
    {
      title: 'Row actions with icons and a destructive item',
      code: `<lz-dropdown
  title=""
  icon="ellipsis-vertical"
  ariaLabel="Campaign actions"
  sizeVariant="sm"
  placement="bottom-end"
  [sections]="[{ heading: '', items: [
    { label: 'View details', value: 'view', icon: 'eye' },
    { label: 'Duplicate', value: 'duplicate', icon: 'document-duplicate' },
    { label: 'Delete', value: 'delete', icon: 'trash', tone: 'danger' }
  ] }]"
  (itemSelected)="onAction($event)"
/>`,
    },
    {
      title: 'Switcher with the current choice and an action',
      code: `<lz-dropdown
  [title]="active.name"
  icon="building-office-2"
  [fullWidth]="true"
  placement="top-start"
  [sections]="[
    { heading: 'Switch organization', items: orgs.map(o => ({
        label: o.name, value: o.id, selected: o.id === active.id })) },
    { heading: '', items: [{ label: 'Add organization', value: 'add', icon: 'plus' }] }
  ]"
  (itemSelected)="onOrg($event)"
/>`,
    },
    {
      title: 'Profile menu opened by an avatar',
      code: `<lz-dropdown ariaLabel="Account" placement="bottom-end"
  [sections]="[{ heading: 'Ana Pop', items: ['Profile', 'Log out'] }]"
  (itemSelected)="onProfile($event)">
  <lz-avatar lzDropdownTrigger firstName="Ana" lastName="Pop" size="sm" />
</lz-dropdown>`,
    },
  ],
  tokens: [
    { name: '--lz-dropdown-border', description: 'Trigger border (#121212 10%)' },
    { name: '--lz-dropdown-radius', description: 'Trigger radius (6px)' },
    { name: '--lz-shadow-dropdown', description: 'Menu shadow (Figma Dropdown-Shadow)' },
    { name: '--lz-color-danger', description: 'Danger item text and icon' },
    { name: '--lz-color-danger-surface', description: 'Danger item hover background' },
    { name: '--lz-z-dropdown', description: 'Overlay layer (Floating UI)' },
  ],
};
