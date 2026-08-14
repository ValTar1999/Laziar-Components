import { DocsComponentMeta } from '../../core/component-doc.model';

const TOOLTIP_POSITIONS = [
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;

export const TOOLTIP_COMPONENT_META: DocsComponentMeta = {
  name: 'Tooltip',
  selector: 'lz-tooltip',
  description:
    'Wrapper around a tag/element: CDK Overlay panel on hover or click. Alias: `lz-tooltip-hover`.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Title',
    },
    {
      name: 'text',
      kind: 'string',
      default: 'Tooltip text',
    },
    {
      name: 'position',
      kind: 'select',
      options: [...TOOLTIP_POSITIONS],
      default: 'top',
    },
    {
      name: 'theme',
      kind: 'select',
      options: ['dark', 'light'],
      default: 'dark',
    },
    {
      name: 'arrow',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'trigger',
      kind: 'select',
      options: ['hover', 'click'],
      default: 'hover',
    },
  ],
  variants: [
    {
      label: 'hover · top',
      props: {
        title: 'Title',
        text: 'Tooltip text',
        position: 'top',
        theme: 'dark',
        arrow: false,
        disabled: false,
        trigger: 'hover',
      },
    },
    {
      label: 'click · arrow',
      props: {
        title: 'Click',
        text: 'Opens on click',
        position: 'bottom',
        theme: 'dark',
        arrow: true,
        disabled: false,
        trigger: 'click',
      },
    },
    {
      label: 'light · top-right',
      props: {
        title: 'Light',
        text: 'Light theme',
        position: 'top-right',
        theme: 'light',
        arrow: true,
        disabled: false,
        trigger: 'hover',
      },
    },
  ],
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Panel title',
    },
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'Panel text',
    },
    {
      name: 'img',
      type: 'string',
      default: "''",
      description: 'Image URL in the panel',
    },
    {
      name: 'position',
      type: `'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`,
      default: `'top'`,
      description: 'CDK overlay position',
    },
    {
      name: 'theme',
      type: `'dark' | 'light'`,
      default: `'dark'`,
      description: 'Panel theme',
    },
    {
      name: 'arrow',
      type: 'boolean',
      default: 'false',
      description: 'Show arrow',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables opening',
    },
    {
      name: 'trigger',
      type: `'hover' | 'click'`,
      default: `'hover'`,
      description: 'Opening method',
    },
    {
      name: 'triggerClass',
      type: 'string',
      default: 'undefined',
      description: 'Trigger wrapper class',
    },
  ],
  outputs: [],
  slots: [
    {
      name: '(default)',
      description: 'Trigger — button, icon, link, etc.',
    },
  ],
  examples: [
    {
      title: 'Hover',
      code: `<lz-tooltip title="Profile" text="Open settings" position="top">
  <button type="button">Hover me</button>
</lz-tooltip>`,
    },
    {
      title: 'Click + arrow',
      code: `<lz-tooltip
  trigger="click"
  [arrow]="true"
  title="Menu"
  text="Extra actions"
>
  <button type="button">Open</button>
</lz-tooltip>`,
    },
  ],
  tokens: [
    { name: 'CDK Overlay pane', description: 'lz-tooltip-cdk-pane class' },
    {
      name: 'data-panel-theme',
      description: 'dark / light panel theme (do not confuse with app data-theme)',
    },
  ],
};
