import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_INPUT_APPEARANCES, LZ_INPUT_SIZES, LZ_INPUT_TYPES } from '@laziar/components';

export const INPUT_COMPONENT_META: DocsComponentMeta = {
  name: 'InputComponent',
  selector: 'lz-input',
  description: 'Text field with label, helper, button, and appearance variants.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Email',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'you@example.com',
    },
    {
      name: 'type',
      kind: 'select',
      options: [...LZ_INPUT_TYPES],
      default: 'text',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_INPUT_SIZES],
      default: 'lg',
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
    {
      name: 'pill',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'appearance',
      kind: 'select',
      options: [...LZ_INPUT_APPEARANCES],
      default: 'default',
    },
    {
      name: 'prefix',
      kind: 'string',
      default: '',
    },
    {
      name: 'buttonLabel',
      kind: 'string',
      default: '',
    },
    {
      name: 'withButton',
      kind: 'select',
      options: ['', 'left', 'right'],
      default: '',
      description: 'Empty string → null (no button)',
    },
    {
      name: 'iconButton',
      kind: 'string',
      default: '',
    },
  ],
  variants: [
    {
      label: 'default · lg',
      props: { label: 'Email', type: 'email', size: 'lg', placeholder: 'you@example.com' },
    },
    {
      label: 'search · pill',
      props: { label: '', type: 'search', size: 'md', placeholder: 'Search', pill: true },
    },
    {
      label: 'error',
      props: {
        label: 'Email',
        type: 'email',
        size: 'lg',
        error: true,
        helperText: 'Invalid email',
      },
    },
    {
      label: 'addon · left',
      props: {
        label: 'Email',
        size: 'md',
        placeholder: 'you@example.com',
        withButton: 'left',
        buttonLabel: 'Button',
        helperText: 'Helper text',
      },
    },
    {
      label: 'addon · icon mini',
      props: {
        label: 'Email',
        size: 'md',
        placeholder: 'you@example.com',
        withButton: 'left',
        iconButton: 'envelope',
      },
    },
    {
      label: 'addon · right',
      props: {
        label: 'Label',
        size: 'md',
        placeholder: '',
        withButton: 'right',
        buttonLabel: 'Button',
        helperText: 'Helper text',
      },
    },
    {
      label: 'disabled',
      props: {
        label: 'Email',
        type: 'email',
        size: 'lg',
        disabled: true,
        placeholder: 'you@example.com',
      },
    },
    {
      label: 'laziarPanel',
      props: {
        label: '',
        type: 'search',
        size: 'md',
        appearance: 'laziarPanel',
        placeholder: 'Find…',
      },
    },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: "''",
      description: 'Label above the field',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Placeholder',
    },
    {
      name: 'type',
      type: `'text' | 'email' | 'password' | 'search'`,
      default: `'text'`,
      description: 'Input type',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'lg'`,
      description: 'Field size',
    },
    {
      name: 'helperText',
      type: 'string',
      default: "''",
      description: 'Hint / error below the field',
    },
    {
      name: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Error state',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the field',
    },
    {
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Fully rounded',
    },
    {
      name: 'appearance',
      type: `'default' | 'laziarPanel'`,
      default: `'default'`,
      description: 'Visual style',
    },
    {
      name: 'prefix',
      type: 'string',
      default: "''",
      description: 'Prefix on the left in the field',
    },
    {
      name: 'withButton',
      type: `'left' | 'right' | null`,
      default: 'null',
      description: 'Embedded button position',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      default: "''",
      description: 'Button text',
    },
    {
      name: 'iconButton',
      type: 'string',
      default: 'undefined',
      description: 'Icon instead of button text',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'OutputEmitterRef<string>',
      description: 'Value change',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'With ngModel',
      code: `<lz-input
  label="Email"
  type="email"
  [(ngModel)]="email"
  helperText="We do not share the address with third parties"
/>`,
    },
    {
      title: 'Search',
      code: `<lz-input type="search" pill placeholder="Search" [(ngModel)]="q" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900 / 10%', description: 'Default border' },
    { name: '--lz-color-background', description: 'Field background (#FFFFFA)' },
    { name: '--lz-color-danger-500', description: 'Border and helper on error' },
  ],
};
