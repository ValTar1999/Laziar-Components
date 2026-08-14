import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_DROPDOWN_SIZES } from '@laziar/components';

export const DROPDOWN_COMPONENT_META: DocsComponentMeta = {
  name: 'DropdownComponent',
  selector: 'lz-dropdown',
  description:
    'Menu dropdown with a trigger button and sectioned items. Overlay via CDK + Floating UI.',
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
    { label: 'disabled', props: { title: 'Menu', sizeVariant: 'xl', disabled: true } },
  ],
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: `'Menu'`,
      description: 'Trigger label',
    },
    {
      name: 'sections',
      type: 'LzDropdownSection[]',
      default: '[]',
      description: 'Menu groups: heading + items',
    },
    {
      name: 'sizeVariant',
      type: `'xl' | 'lg' | 'md' | 'sm'`,
      default: `'xl'`,
      description: 'Trigger size',
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
      description: 'Fires with the clicked item label',
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
  slots: [],
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
  ],
  tokens: [
    { name: '--lz-dropdown-border', description: 'Trigger border (#121212 10%)' },
    { name: '--lz-dropdown-radius', description: 'Trigger radius (6px)' },
    { name: '--lz-shadow-dropdown', description: 'Menu shadow (Figma Dropdown-Shadow)' },
    { name: '--lz-z-dropdown', description: 'Overlay layer (Floating UI)' },
  ],
};
