import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_BUTTON_COLORS, LZ_BUTTON_SIZES, LZ_BUTTON_VARIANTS } from '@laziar/components';

const variantSizeGallery = LZ_BUTTON_VARIANTS.flatMap((variant) =>
  LZ_BUTTON_SIZES.map((size) => ({
    label: `${variant} · ${size}`,
    props: {
      variant,
      size,
      color: 'gray',
      // as in publikator: iconOnly = icon without label; others — text only
      label: variant === 'iconOnly' ? '' : variant,
      icon: variant === 'iconOnly' ? 'plus' : '',
      disabled: false,
      pill: false,
      fullWidth: false,
      iconPosition: 'right',
      type: 'button',
    },
  })),
);

export const BUTTON_COMPONENT_META: DocsComponentMeta = {
  name: 'Button',
  selector: 'lz-button',
  description:
    'Reference library component. Unified publikator + agora-frontend API: variants, sizes, palette, a11y, and explicit buttonClick.',
  contentFrom: 'label',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Save',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...LZ_BUTTON_VARIANTS],
      default: 'primary',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_BUTTON_SIZES],
      default: 'md',
    },
    {
      name: 'color',
      kind: 'select',
      options: [...LZ_BUTTON_COLORS],
      default: 'gray',
    },
    {
      name: 'type',
      kind: 'select',
      options: ['button', 'submit', 'reset'],
      default: 'button',
    },
    {
      name: 'icon',
      kind: 'string',
      default: 'check',
      description:
        'Symbol name from /assets/icons/icons-{outline|solid|…}.svg (for example check, x-mark, plus)',
    },
    {
      name: 'iconVariant',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro'],
      default: 'outline',
      description: 'lz-icon sprite: outline / solid / mini / micro',
    },
    {
      name: 'iconPosition',
      kind: 'select',
      options: ['left', 'right'],
      default: 'right',
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
      name: 'fullWidth',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: variantSizeGallery,
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: "''",
      description: 'Button text (alternative — default ng-content)',
    },
    {
      name: 'variant',
      type: `'primary' | 'outline' | 'secondary' | 'tertiary' | 'link' | 'iconOnly'`,
      default: `'primary'`,
      description: 'Visual variant',
    },
    {
      name: 'size',
      type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
      default: `'md'`,
      description: 'Size (publikator padding)',
    },
    {
      name: 'type',
      type: `'button' | 'submit' | 'reset'`,
      default: `'button'`,
      description: 'Native <button> type',
    },
    {
      name: 'icon',
      type: 'string',
      default: 'undefined',
      description: 'Icon name; custom — [lzButtonIcon] slot',
    },
    {
      name: 'iconVariant',
      type: `'outline' | 'solid' | 'mini' | 'micro'`,
      default: 'undefined',
      description: 'Sprite variant for lz-icon (type)',
    },
    {
      name: 'iconPosition',
      type: `'left' | 'right'`,
      default: `'right'`,
      description: 'Icon position relative to text',
    },
    {
      name: 'iconClass',
      type: 'string',
      default: 'undefined',
      description: 'Extra class on the icon wrapper',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the button and blocks buttonClick',
    },
    {
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Fully rounded (rounded-full)',
    },
    {
      name: 'color',
      type: `'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple'`,
      default: `'gray'`,
      description: 'Palette → semantic tokens',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Stretch to 100% of host width',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: 'undefined',
      description: 'aria-label (required for icon-only, otherwise fallback)',
    },
    {
      name: 'ariaCurrentPage',
      type: 'boolean',
      default: 'false',
      description: 'Sets aria-current="page" (pagination)',
    },
  ],
  outputs: [
    {
      name: 'buttonClick',
      type: 'OutputEmitterRef<void>',
      description: 'Click / activation, only when not disabled',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Extra content next to the label',
    },
    {
      name: '[lzButtonIcon]',
      description: 'Custom icon instead of a named lz-icon',
    },
  ],
  deprecated: [
    {
      name: 'rounded',
      type: 'boolean',
      replacedBy: 'pill',
      description: 'Old name from publikator/agora',
    },
    {
      name: 'iconDirection',
      type: `'left' | 'right'`,
      replacedBy: 'iconPosition',
      description: 'Old icon-position name',
    },
  ],
  examples: [
    {
      title: 'In a form',
      description: 'Submit primary + secondary cancel.',
      code: `<form (ngSubmit)="save()">
  <lz-button variant="secondary" color="gray" label="Cancel" />
  <lz-button type="submit" variant="primary" color="red" label="Save" icon="check" />
</form>`,
    },
    {
      title: 'In a modal',
      description: 'Dialog footer.',
      code: `<footer class="dialog-actions">
  <lz-button variant="tertiary" color="gray" label="Cancel" (buttonClick)="close()" />
  <lz-button variant="primary" color="red" label="Delete" (buttonClick)="confirm()" />
</footer>`,
    },
    {
      title: 'Icon-only with a11y',
      code: `<lz-button
  variant="iconOnly"
  icon="x-mark"
  ariaLabel="Close"
  (buttonClick)="close()"
/>`,
    },
    {
      title: 'Deprecated alias (migrations)',
      description: 'rounded → pill; do not use in new code.',
      code: `<!-- preferred -->
<lz-button pill label="Pill" />
<!-- @deprecated -->
<lz-button [rounded]="true" label="Pill" />`,
    },
  ],
  tokens: [
    { name: '--lz-button-fg', description: 'Text / icon color' },
    { name: '--lz-button-bg', description: 'Background' },
    { name: '--lz-button-bg-hover', description: 'Hover background' },
    { name: '--lz-button-border', description: 'Border color' },
    { name: '--lz-button-ring', description: 'focus-visible ring' },
    { name: '--lz-button-radius', description: 'Rounding (overridden by pill)' },
    { name: '--lz-button-icon-size', description: 'Icon size by size' },
    { name: '--lz-button-tone-*', description: 'Local tone scale from color' },
    { name: '--lz-color-primary / secondary / …', description: 'Semantic palettes' },
    { name: '--lz-color-purple-*', description: 'purple palette for color="purple"' },
    { name: '--lz-duration-normal', description: 'Transition duration' },
    { name: '--lz-radius-full', description: 'Pill shape' },
  ],
};
