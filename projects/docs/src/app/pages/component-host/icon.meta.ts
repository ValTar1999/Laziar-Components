import { DocsComponentMeta } from '../../core/component-doc.model';

const iconTypes = ['outline', 'solid', 'mini', 'micro', 'custom'] as const;

export const ICON_COMPONENT_META: DocsComponentMeta = {
  name: 'Icon',
  selector: 'lz-icon',
  description:
    'SVG icon from Heroicons / custom sprites: outline, solid, mini, micro, custom. Built-in sprites are bundled with the package.',
  controls: [
    {
      name: 'name',
      kind: 'string',
      default: 'check',
      description: 'Symbol name (for example check, x-mark, plus)',
    },
    {
      name: 'type',
      kind: 'select',
      options: [...iconTypes],
      default: 'outline',
      description: 'Sprite: icons-{type}.svg',
    },
  ],
  variants: [
    { label: 'outline · check', props: { name: 'check', type: 'outline' } },
    { label: 'solid · check', props: { name: 'check', type: 'solid' } },
    { label: 'mini · plus', props: { name: 'plus', type: 'mini' } },
    { label: 'micro · x-mark', props: { name: 'x-mark', type: 'micro' } },
    { label: 'outline · heart', props: { name: 'heart', type: 'outline' } },
    { label: 'solid · star', props: { name: 'star', type: 'solid' } },
  ],
  inputs: [
    {
      name: 'name',
      type: 'string',
      default: '— (required)',
      description: 'Symbol id in the SVG sprite',
    },
    {
      name: 'type',
      type: `'outline' | 'solid' | 'mini' | 'micro' | 'custom'`,
      default: `'outline'`,
      description: 'Sprite variant',
    },
    {
      name: 'iconClass',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Extra SVG classes; w-* disables the default size',
    },
    {
      name: 'assetsPath',
      type: 'string',
      default: `'assets/icons'`,
      description: 'Base path to the sprite folder',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'In a button',
      code: `<lz-icon name="check" type="outline" />`,
    },
    {
      title: 'Custom size via iconClass',
      code: `<lz-icon name="plus" type="mini" iconClass="w-4 h-4" />`,
    },
    {
      title: 'Custom sprite',
      description: 'The symbol must be in icons-custom.svg.',
      code: `<lz-icon name="brand-mark" type="custom" />`,
    },
  ],
  tokens: [
    { name: '--lz-icon-size', description: 'Default width/height (1.5rem)' },
    { name: 'currentColor', description: 'Icon color inherits from the parent' },
  ],
};
