import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_SELECT_SIZES } from '@laziar/components';

export const SELECT_COMPONENT_META: DocsComponentMeta = {
  name: 'SelectComponent',
  selector: 'lz-select',
  description:
    'Dropdown list with label, sm/md sizes, helper text, optional search, and a multiple mode with checkboxes.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Select an option',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'Select…',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_SELECT_SIZES],
      default: 'md',
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
      name: 'searchable',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'multiple',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: [
    {
      label: 'md · default',
      props: { label: 'Select an option', size: 'md', placeholder: 'Select…' },
    },
    {
      label: 'sm',
      props: { label: 'Size sm', size: 'sm', placeholder: '…' },
    },
    {
      label: 'with helper',
      props: {
        label: 'City',
        size: 'md',
        helperText: 'Can be changed later',
      },
    },
    {
      label: 'error',
      props: {
        label: 'City',
        size: 'md',
        helperText: 'Required field',
        error: true,
      },
    },
    {
      label: 'disabled',
      props: { label: 'Unavailable', size: 'md', disabled: true },
    },
    {
      label: 'multiple + search',
      props: { label: 'Countries', size: 'md', multiple: true, searchable: true },
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
      default: `'Select...'`,
      description: 'Text when nothing is selected',
    },
    {
      name: 'options',
      type: 'LzSelectOptionType[]',
      default: '[]',
      description: 'Options list (string | { id, title, date })',
    },
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'md'`,
      description: 'Control size',
    },
    {
      name: 'helperText',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Hint below the field',
    },
    {
      name: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Error state (border and helper)',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables select',
    },
    {
      name: 'searchable',
      type: 'boolean',
      default: 'false',
      description: 'Search box above the options, filtering them by label and date',
    },
    {
      name: 'searchPlaceholder',
      type: 'string',
      default: "'Search'",
      description: 'Placeholder and accessible name of the search box',
    },
    {
      name: 'noResultsText',
      type: 'string',
      default: "'No results'",
      description: 'Shown when a search matches no option',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description:
        'Several options can be chosen: the value is an array of options, each pick toggles one and the list stays open',
    },
    {
      name: 'selectionSummary',
      type: '((selected: readonly LzSelectOptionType[]) => string) | null',
      default: 'null',
      description:
        'multiple only: trigger text for the chosen options; by default their labels joined by commas',
    },
  ],
  outputs: [
    {
      name: 'opened',
      type: 'OutputEmitterRef<void>',
      description: 'Fires when the list opens',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'With ngModel',
      code: `<lz-select
  label="Option"
  [options]="['A', 'B', 'C']"
  [(ngModel)]="value"
/>`,
    },
    {
      title: 'Multiple with search',
      code: `<lz-select
  label="Countries"
  placeholder="Choose countries..."
  multiple
  searchable
  [options]="countries"
  [selectionSummary]="summary"
  [(ngModel)]="chosen"
/>

// chosen: LzSelectOptionType[] = [];
// summary = (c: readonly LzSelectOptionType[]) => \`\${c.length} selected\`;`,
    },
  ],
  tokens: [
    { name: '--lz-select-border', description: 'Trigger border (#121212 10%)' },
    { name: '--lz-select-radius', description: 'Trigger radius (6px)' },
    { name: '--lz-shadow-dropdown', description: 'Select Menu shadow (Figma Dropdown-Shadow)' },
    { name: '--lz-z-dropdown', description: 'List layer (Floating UI overlay)' },
  ],
};
