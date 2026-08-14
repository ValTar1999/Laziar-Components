import { DocsComponentMeta } from '../../core/component-doc.model';

const styles = ['outline', 'underline', 'border'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export const TABS_COMPONENT_META: DocsComponentMeta = {
  name: 'Tabs',
  selector: 'lz-tabs',
  description:
    'Horizontal tab list: outline / underline / border styles, sizes, and active index. Supports badges, icons, and disabled tabs.',
  controls: [
    {
      name: 'style',
      kind: 'select',
      options: [...styles],
      default: 'outline',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...sizes],
      default: 'md',
    },
    {
      name: 'activeTab',
      kind: 'number',
      default: 0,
      description: 'Active tab index (one-way in the sandbox)',
    },
  ],
  variants: [
    { label: 'outline · md', props: { style: 'outline', size: 'md', activeTab: 0 } },
    { label: 'underline · md', props: { style: 'underline', size: 'md', activeTab: 1 } },
    { label: 'border · md', props: { style: 'border', size: 'md', activeTab: 0 } },
    { label: 'outline · sm', props: { style: 'outline', size: 'sm', activeTab: 0 } },
    { label: 'underline · lg', props: { style: 'underline', size: 'lg', activeTab: 2 } },
    { label: 'border · lg', props: { style: 'border', size: 'lg', activeTab: 1 } },
  ],
  inputs: [
    {
      name: 'tabs',
      type: 'string[]',
      default: '[]',
      description: 'Tab labels',
    },
    {
      name: 'style',
      type: `'outline' | 'underline' | 'border'`,
      default: `'outline'`,
      description: 'outline — pill; underline — line; border — bordered segment',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Size (tab padding)',
    },
    {
      name: 'activeTab',
      type: 'number (model)',
      default: '0',
      description: 'Two-way active tab index',
    },
    {
      name: 'badges',
      type: '(LzTabBadge | null)[]',
      default: '[]',
      description: 'Optional badges by tab index',
    },
    {
      name: 'icons',
      type: 'string[]',
      default: '[]',
      description: 'Icon names (lz-icon) by index',
    },
    {
      name: 'disabledTabIndexes',
      type: 'number[]',
      default: '[]',
      description: 'Indexes of unavailable tabs',
    },
    {
      name: 'disabledTabTooltips',
      type: 'Record<string, string>',
      default: '{}',
      description: 'Tooltips for disabled tabs (key is the index as a string)',
    },
    {
      name: 'disabledTabTooltipTrigger',
      type: `'hover' | 'click'`,
      default: `'hover'`,
      description: 'Tooltip trigger on a disabled tab',
    },
    {
      name: 'class',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Extra class on the root',
    },
  ],
  outputs: [
    {
      name: 'activeTab',
      type: 'ModelSignal<number>',
      description: 'Active index change (model)',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Basic tab list',
      code: `<lz-tabs
  [tabs]="['Overview', 'Members', 'Settings']"
  style="underline"
  size="md"
  [(activeTab)]="active"
/>`,
    },
    {
      title: 'With icons and badges',
      code: `<lz-tabs
  [tabs]="labels"
  [icons]="['home', 'users', 'cog-6-tooth']"
  [badges]="[{ text: '3', variant: 'red' }, null, null]"
  style="border"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900', description: 'Active pill fill (outline) and underline indicator' },
    { name: '--lz-color-text-inverse', description: 'Text on the active pill' },
    { name: '--lz-color-neutral-50', description: 'Hover background' },
    { name: '--lz-color-neutral-500', description: 'Inactive tab text' },
    { name: '--lz-radius-full', description: 'outline style pill' },
  ],
};
