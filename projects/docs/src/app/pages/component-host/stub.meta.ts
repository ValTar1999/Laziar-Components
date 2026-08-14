import { DocsComponentMeta } from '../../core/component-doc.model';

/** Placeholder component page used to validate the docs layout. */
export const STUB_COMPONENT_META: DocsComponentMeta = {
  name: 'Stub',
  selector: 'lz-stub',
  description:
    'Placeholder for testing the documentation framework: preview, sandbox, synchronized code, variants, API, and tokens.',
  contentFrom: 'label',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost'],
      default: 'primary',
      description: 'Visual variant',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      default: 'md',
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'label',
      kind: 'string',
      default: 'Click me',
    },
    {
      name: 'accent',
      kind: 'color',
      default: '#d50b0b',
      description: 'Local accent (color picker demo)',
    },
    {
      name: 'maxWidth',
      kind: 'number',
      default: 280,
      description: 'Maximum width in px',
    },
  ],
  variants: [
    {
      label: 'primary · sm',
      props: {
        variant: 'primary',
        size: 'sm',
        disabled: false,
        label: 'Primary sm',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'primary · md',
      props: {
        variant: 'primary',
        size: 'md',
        disabled: false,
        label: 'Primary md',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'primary · lg',
      props: {
        variant: 'primary',
        size: 'lg',
        disabled: false,
        label: 'Primary lg',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'secondary · md',
      props: {
        variant: 'secondary',
        size: 'md',
        disabled: false,
        label: 'Secondary',
        accent: '#0d56e7',
        maxWidth: 280,
      },
    },
    {
      label: 'ghost · md',
      props: {
        variant: 'ghost',
        size: 'md',
        disabled: false,
        label: 'Ghost',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'primary · disabled',
      props: {
        variant: 'primary',
        size: 'md',
        disabled: true,
        label: 'Disabled',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
  ],
  inputs: [
    {
      name: 'variant',
      type: `'primary' | 'secondary' | 'ghost'`,
      default: `'primary'`,
      description: 'Button visual style',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Size',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction',
    },
    {
      name: 'label',
      type: 'string',
      default: `'Click me'`,
      description: 'Text (in the real API this goes through ng-content)',
    },
    {
      name: 'accent',
      type: 'string',
      default: `'#d50b0b'`,
      description: 'Demo color for the color picker',
    },
    {
      name: 'maxWidth',
      type: 'number',
      default: '280',
      description: 'Width limit',
    },
  ],
  outputs: [
    {
      name: 'pressed',
      type: 'EventEmitter<void>',
      description: 'Button click (when not disabled)',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Button content (icon + text)',
    },
    {
      name: '[lzPrefix]',
      description: 'Slot to the left of the text',
    },
  ],
  deprecated: [
    {
      name: 'type',
      type: `'primary' | 'secondary'`,
      replacedBy: 'variant',
      description: 'Old variant name from publikator',
    },
    {
      name: 'btnSize',
      type: `'sm' | 'md' | 'lg'`,
      replacedBy: 'size',
      description: 'Deprecated size alias',
    },
  ],
  examples: [
    {
      title: 'In a form',
      description: 'Primary submit button next to secondary cancel.',
      code: `<form (ngSubmit)="save()">
  <lz-stub variant="secondary" size="md">Cancel</lz-stub>
  <lz-stub variant="primary" size="md">Save</lz-stub>
</form>`,
    },
    {
      title: 'In a modal',
      description: 'Dialog footer aligned to the right.',
      code: `<lz-modal>
  <p>Delete this record?</p>
  <footer>
    <lz-stub variant="ghost">Cancel</lz-stub>
    <lz-stub variant="primary">Delete</lz-stub>
  </footer>
</lz-modal>`,
    },
  ],
  tokens: [
    {
      name: '--lz-color-primary',
      description: 'primary variant fill',
    },
    {
      name: '--lz-color-secondary',
      description: 'secondary variant fill',
    },
    {
      name: '--lz-radius-md',
      description: 'Button rounding',
    },
    {
      name: '--lz-duration-fast',
      description: 'hover/focus transition duration',
    },
    {
      name: '--lz-shadow-focus',
      description: 'Focus ring',
    },
  ],
};
