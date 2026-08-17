import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_BADGE_COLORS, LZ_BADGE_SIZES, LZ_BADGE_VARIANTS } from '@laziar/components';

const BADGE_COLORS = LZ_BADGE_COLORS;

export const BADGE_COMPONENT_META: DocsComponentMeta = {
  name: 'Badge',
  selector: 'lz-badge',
  description: 'Compact chip/label with a color palette, sizes, pill shape, and optional icon.',
  contentFrom: 'label',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Badge',
      description: 'Projected content (ng-content)',
    },
    {
      name: 'color',
      kind: 'select',
      options: [...BADGE_COLORS],
      default: 'gray',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_BADGE_SIZES],
      default: 'sm',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...LZ_BADGE_VARIANTS],
      default: 'subtle',
    },
    {
      name: 'border',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'pill',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'icon',
      kind: 'string',
      default: '',
      description: 'lz-icon name; empty — no icon',
    },
    {
      name: 'iconPosition',
      kind: 'select',
      options: ['left', 'right'],
      default: 'left',
    },
    {
      name: 'iconVariant',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro'],
      default: 'solid',
    },
  ],
  variants: [
    ...BADGE_COLORS.slice(0, 6).map((color) => ({
      label: color,
      props: {
        label: color,
        color,
        size: 'sm',
        variant: 'subtle',
        border: false,
        pill: false,
        disabled: false,
        icon: '',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    })),
    {
      label: 'solid · gray',
      props: {
        label: 'Badge',
        color: 'gray',
        size: 'sm',
        variant: 'solid',
        border: false,
        pill: false,
        disabled: false,
        icon: '',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    },
    {
      label: 'pill · outline · icon',
      props: {
        label: 'New',
        color: 'green',
        size: 'md',
        variant: 'outline',
        border: false,
        pill: true,
        disabled: false,
        icon: 'check',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    },
    {
      label: 'disabled',
      props: {
        label: 'Off',
        color: 'gray',
        size: 'sm',
        variant: 'subtle',
        border: false,
        pill: false,
        disabled: true,
        icon: '',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    },
  ],
  inputs: [
    {
      name: 'color',
      type: `'green' | 'red' | 'purple' | 'yellow' | 'blue' | 'orange' | 'magenta' | 'teal' | 'gray' | 'violet'`,
      default: `'gray'`,
      description: 'Color theme (alias magrnta → magenta)',
    },
    {
      name: 'size',
      type: `'lg' | 'md' | 'sm'`,
      default: `'sm'`,
      description: 'Badge size',
    },
    {
      name: 'variant',
      type: `'subtle' | 'solid' | 'outline'`,
      default: `'subtle'`,
      description: 'Fill: pastel, solid, outline',
    },
    {
      name: 'border',
      type: 'boolean',
      default: 'false',
      description: 'Border (same as variant=outline when variant=subtle)',
    },
    {
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Fully rounded shape',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disabled state',
    },
    {
      name: 'icon',
      type: 'string',
      default: 'undefined',
      description: 'Icon name; custom — [lzBadgeIcon] slot',
    },
    {
      name: 'iconPosition',
      type: `'left' | 'right'`,
      default: `'left'`,
      description: 'Icon position',
    },
    {
      name: 'iconVariant',
      type: `'outline' | 'solid' | 'mini' | 'micro'`,
      default: `'solid'`,
      description: 'lz-icon sprite variant',
    },
    {
      name: 'img',
      type: 'string',
      default: 'undefined',
      description: 'Image URL on the left',
    },
    {
      name: 'iconClickable',
      type: 'boolean',
      default: 'false',
      description: 'Icon is clickable and emits iconClick',
    },
    {
      name: 'iconAriaLabel',
      type: 'string',
      default: "''",
      description: 'aria-label for the clickable icon',
    },
  ],
  outputs: [
    {
      name: 'iconClick',
      type: 'OutputEmitterRef<void>',
      description: 'Icon click (if iconClickable)',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Badge text / content',
    },
    {
      name: '[lzBadgeIcon]',
      description: 'Custom icon instead of a named lz-icon',
    },
  ],
  examples: [
    {
      title: 'Solid',
      code: `<lz-badge color="gray" variant="solid">Badge</lz-badge>`,
    },
    {
      title: 'Status',
      code: `<lz-badge color="green" pill>Active</lz-badge>`,
    },
    {
      title: 'With icon',
      code: `<lz-badge color="blue" icon="check" iconPosition="left">Verified</lz-badge>`,
    },
    {
      title: 'Outline',
      code: `<lz-badge color="purple" variant="outline" size="md">Pro</lz-badge>`,
    },
  ],
  tokens: [
    { name: '--lz-badge-bg / --lz-badge-fg', description: 'Pastel background and text' },
    { name: '--lz-badge-solid-bg / --lz-badge-solid-fg', description: 'Solid fill' },
    { name: '--lz-icon-size', description: 'Icon size inside the badge' },
  ],
};
