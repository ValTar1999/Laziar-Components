import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_SELECT_SIZES } from '@laziar/components';

export const SELECT_COMPONENT_META: DocsComponentMeta = {
  name: 'SelectComponent',
  selector: 'lz-select',
  description: 'Dropdown list with label, sm/md sizes, and helper text.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Select an option',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'Select…',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_SELECT_SIZES],
      default: 'md',
    },
    {
      name: 'helperText',
      kind: 'string',
      default: '',
    },
    {
      name: 'error',
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
    {
      label: 'md · default',
      props: { label: 'Select an option', size: 'md', placeholder: 'Select…' },
    },
    {
      label: 'sm',
      props: { label: 'Size sm', size: 'sm', placeholder: '…' },
    },
    {
      label: 'with helper',
      props: {
        label: 'City',
        size: 'md',
        helperText: 'Can be changed later',
      },
    },
    {
      label: 'error',
      props: {
        label: 'City',
        size: 'md',
        helperText: 'Required field',
        error: true,
      },
    },
    {
      label: 'disabled',
      props: { label: 'Unavailable', size: 'md', disabled: true },
    },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Label above the field',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: `'Select...'`,
      description: 'Text when nothing is selected',
    },
    {
      name: 'options',
      type: 'LzSelectOptionType[]',
      default: '[]',
      description: 'Options list (string | { id, title, date })',
    },
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'md'`,
      description: 'Control size',
    },
    {
      name: 'helperText',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Hint below the field',
    },
    {
      name: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Error state (border and helper)',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables select',
    },
  ],
  outputs: [
    {
      name: 'opened',
      type: 'OutputEmitterRef<void>',
      description: 'Fires when the list opens',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'With ngModel',
      code: `<lz-select
  label="Option"
  [options]="['A', 'B', 'C']"
  [(ngModel)]="value"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-select-border', description: 'Trigger border (#121212 10%)' },
    { name: '--lz-select-radius', description: 'Trigger radius (6px)' },
    { name: '--lz-shadow-dropdown', description: 'Select Menu shadow (Figma Dropdown-Shadow)' },
    { name: '--lz-z-dropdown', description: 'List layer (Floating UI overlay)' },
  ],
};
