import { DocsComponentMeta } from '../../core/component-doc.model';
import { AlertVariants } from '@laziar/components';

export const ALERT_COMPONENT_META: DocsComponentMeta = {
  name: 'Alert',
  selector: 'lz-alert',
  description:
    'Notification banner with an icon, title, text, and optional close button. Supports semantic variants and horizontal layout.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Success',
    },
    {
      name: 'text',
      kind: 'string',
      default: 'Changes saved.',
    },
    {
      name: 'iconName',
      kind: 'string',
      default: 'check-circle',
      description: 'lz-icon symbol name',
    },
    {
      name: 'iconVariant',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro', 'custom'],
      default: 'outline',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...AlertVariants],
      default: 'default',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['base', 'sm'],
      default: 'sm',
    },
    {
      name: 'padding',
      kind: 'select',
      options: ['p-3', 'p-4'],
      default: 'p-4',
    },
    {
      name: 'isRow',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'isRowtext',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'showCloseButton',
      kind: 'boolean',
      default: true,
    },
  ],
  variants: AlertVariants.map((variant) => ({
    label: variant,
    props: {
      variant,
      title: variant,
      text: 'Short message',
      iconName: 'check-circle',
      iconVariant: 'outline',
      size: 'sm',
      padding: 'p-4',
      isRow: false,
      isRowtext: false,
      showCloseButton: true,
    },
  })),
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: `'Alert title'`,
      description: 'Banner title',
    },
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'Main text',
    },
    {
      name: 'iconName',
      type: 'string',
      default: `'check-circle'`,
      description: 'lz-icon icon name',
    },
    {
      name: 'iconVariant',
      type: `'outline' | 'solid' | 'mini' | 'micro' | 'custom'`,
      default: `'outline'`,
      description: 'Icon sprite variant',
    },
    {
      name: 'variant',
      type: `'default' | 'gray' | 'warning' | 'error' | 'success' | 'info' | 'purple' | 'dark' | 'red'`,
      default: `'default'`,
      description: 'Semantic / color variant',
    },
    {
      name: 'size',
      type: `'base' | 'sm'`,
      default: `'sm'`,
      description: 'Typography size',
    },
    {
      name: 'padding',
      type: `'p-3' | 'p-4'`,
      default: `'p-4'`,
      description: 'Inner spacing',
    },
    {
      name: 'isRow',
      type: 'boolean',
      default: 'false',
      description: 'Horizontal content layout',
    },
    {
      name: 'isRowtext',
      type: 'boolean',
      default: 'false',
      description: 'Title and text on one line',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: 'true',
      description: 'Show close button',
    },
    {
      name: 'closeColor',
      type: `'gray' | 'yellow' | 'red' | 'green' | 'blue' | 'purple'`,
      default: 'undefined',
      description: 'Close button color override',
    },
    {
      name: 'buttonVariant',
      type: `'primary' | 'outline' | 'secondary' | 'tertiary' | 'link'`,
      default: 'undefined',
      description: 'Close button variant override',
    },
  ],
  outputs: [
    {
      name: 'closed',
      type: 'OutputEmitterRef<void>',
      description: 'Close button click',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Extra content in the alert body (next to the text)',
    },
  ],
  examples: [
    {
      title: 'Success',
      code: `<lz-alert
  variant="success"
  title="Done"
  text="Profile updated"
  iconName="check-circle"
/>`,
    },
    {
      title: 'Error without close',
      code: `<lz-alert
  variant="error"
  title="Error"
  text="Could not save"
  [showCloseButton]="false"
/>`,
    },
    {
      title: 'Row',
      code: `<lz-alert
  variant="info"
  title="Hint"
  text="You can continue"
  [isRow]="true"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-background', description: 'Default background (#FFFFFA)' },
    { name: '--lz-color-neutral-900', description: 'Default 10% outline, dark fill' },
    { name: '--lz-color-success-50 / 500 / 700', description: 'success variant' },
    { name: '--lz-color-danger-50 / 500 / 700', description: 'error and solid red variants' },
    { name: '--lz-color-warning-50 / 500 / 700', description: 'warning variant' },
    { name: '--lz-color-text-inverse', description: 'Text on dark / red' },
    { name: '--lz-radius-lg', description: '8px rounding' },
  ],
};
