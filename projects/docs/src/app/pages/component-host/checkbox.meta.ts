import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_CHECKBOX_TYPES, LZ_CHECKBOX_VARIANTS } from '@laziar/components';

export const CHECKBOX_COMPONENT_META: DocsComponentMeta = {
  name: 'Checkbox',
  selector: 'lz-checkbox',
  description: 'Checkbox and radio button with title, description, and error states.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Accept',
    },
    {
      name: 'type',
      kind: 'select',
      options: [...LZ_CHECKBOX_TYPES],
      default: 'checkbox',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...LZ_CHECKBOX_VARIANTS],
      default: 'default',
    },
    {
      name: 'checked',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'indeterminate',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'rounded',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'description',
      kind: 'string',
      default: '',
    },
  ],
  variants: [
    {
      label: 'checkbox · default',
      props: { type: 'checkbox', variant: 'default', checked: false, title: 'Accept' },
    },
    {
      label: 'checkbox · checked',
      props: { type: 'checkbox', variant: 'default', checked: true, title: 'Accept' },
    },
    {
      label: 'checkbox · error',
      props: { type: 'checkbox', variant: 'error', checked: false, title: 'Required' },
    },
    {
      label: 'radio · default',
      props: { type: 'radio', variant: 'default', checked: false, title: 'Option A' },
    },
    {
      label: 'radio · checked',
      props: { type: 'radio', variant: 'default', checked: true, title: 'Option A' },
    },
    {
      label: 'checkbox · indeterminate',
      props: {
        type: 'checkbox',
        variant: 'default',
        checked: false,
        indeterminate: true,
        title: 'Select all',
      },
    },
    {
      label: 'checkbox · disabled',
      props: {
        type: 'checkbox',
        variant: 'default',
        checked: true,
        disabled: true,
        title: 'Unavailable',
      },
    },
  ],
  inputs: [
    {
      name: 'type',
      type: `'checkbox' | 'radio'`,
      default: `'checkbox'`,
      description: 'Native input type',
    },
    {
      name: 'variant',
      type: `'default' | 'error'`,
      default: `'default'`,
      description: 'Visual validation state',
    },
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description: 'Whether the item is checked',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Indeterminate state (checkbox only)',
    },
    {
      name: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Rounded look (radio is always round)',
    },
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Title / label',
    },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Caption under the title',
    },
  ],
  outputs: [
    {
      name: 'checkedChange',
      type: 'OutputEmitterRef<boolean>',
      description: 'checked change on click',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Consent',
      code: `<lz-checkbox
  title="I accept the terms"
  description="Can be revoked in settings"
  [checked]="accepted"
  (checkedChange)="accepted = $event"
/>`,
    },
    {
      title: 'Radio group',
      code: `<lz-checkbox type="radio" title="Option A" [checked]="value === 'a'" />
<lz-checkbox type="radio" title="Option B" [checked]="value === 'b'" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900', description: 'Checked fill / radio dot' },
    { name: '--lz-color-background', description: 'Unchecked background (#FFFFFA)' },
    { name: '--lz-color-neutral-900 / 20%', description: 'Unchecked border' },
    { name: '--lz-color-danger-500', description: 'variant=error border' },
  ],
};
