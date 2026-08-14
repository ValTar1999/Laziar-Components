import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_TEXTAREA_RESIZE } from '@laziar/components';

export const TEXTAREA_COMPONENT_META: DocsComponentMeta = {
  name: 'TextareaComponent',
  selector: 'lz-textarea',
  description: 'Multiline field with label, helper, and resize setting.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Comment',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'Enter text…',
    },
    {
      name: 'rows',
      kind: 'number',
      default: 4,
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
      name: 'resize',
      kind: 'select',
      options: [...LZ_TEXTAREA_RESIZE],
      default: 'vertical',
    },
  ],
  variants: [
    {
      label: 'default · vertical',
      props: { label: 'Comment', rows: 4, resize: 'vertical' },
    },
    {
      label: 'error',
      props: {
        label: 'Comment',
        rows: 3,
        error: true,
        helperText: 'Required field',
      },
    },
    {
      label: 'resize none',
      props: { label: 'Fixed', rows: 4, resize: 'none' },
    },
    {
      label: 'disabled',
      props: { label: 'Read only', rows: 3, disabled: true },
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
      default: "''",
      description: 'Placeholder',
    },
    {
      name: 'rows',
      type: 'number',
      default: '4',
      description: 'Number of visible rows',
    },
    {
      name: 'helperText',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Hint / error',
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
      name: 'resize',
      type: `'none' | 'vertical' | 'horizontal' | 'both'`,
      default: `'vertical'`,
      description: 'Resize behavior',
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
      code: `<lz-textarea
  label="Description"
  [rows]="5"
  [(ngModel)]="description"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900 / 10%', description: 'Default border' },
    { name: '--lz-color-background', description: 'Field background (#FFFFFA)' },
    { name: '--lz-color-danger-500', description: 'Border and helper on error' },
  ],
};
