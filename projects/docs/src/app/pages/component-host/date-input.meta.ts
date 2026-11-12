import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_DATE_INPUT_SIZES } from '@laziar/components';

export const DATE_INPUT_COMPONENT_META: DocsComponentMeta = {
  name: 'DateInput',
  selector: 'lz-date-input',
  description:
    'A date field styled as lz-select that opens lz-calendar in a popover. The value is a calendar day as a yyyy-mm-dd string, as a native date input holds.',
  controls: [
    { name: 'label', kind: 'string', default: 'Start date' },
    { name: 'size', kind: 'select', options: [...LZ_DATE_INPUT_SIZES], default: 'md' },
    { name: 'helperText', kind: 'string', default: '' },
    { name: 'error', kind: 'boolean', default: false },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  variants: [
    { label: 'md', props: { label: 'Start date', size: 'md' } },
    { label: 'sm', props: { label: 'Start date', size: 'sm' } },
    { label: 'error', props: { label: 'End date', error: true, helperText: 'Pick a later day' } },
    { label: 'disabled', props: { label: 'Start date', disabled: true } },
  ],
  inputs: [
    {
      name: 'value',
      type: 'string | null',
      default: 'null',
      description: 'The chosen day, yyyy-mm-dd; also settable through ngModel / formControl',
    },
    {
      name: 'min',
      type: 'string | null',
      default: 'null',
      description: 'Earliest selectable day, yyyy-mm-dd',
    },
    {
      name: 'max',
      type: 'string | null',
      default: 'null',
      description: 'Latest selectable day, yyyy-mm-dd',
    },
    {
      name: 'label',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Visible label',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: `'Select a date'`,
      description: 'Shown while empty',
    },
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'md'`,
      description: '32px or 40px, as lz-select',
    },
    {
      name: 'helperText',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Line under the field; describes it',
    },
    {
      name: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Error border and helper colour',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
    {
      name: 'locale',
      type: 'string',
      default: `'en-GB'`,
      description: 'Locale of the field text and calendar names',
    },
    {
      name: 'weekStart',
      type: 'LzCalendarWeekStart',
      default: '1',
      description: 'First weekday of the calendar',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Name when there is no visible label',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'OutputEmitterRef<string>',
      description: 'The day just picked, yyyy-mm-dd',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'In a reactive form',
      code: `<lz-date-input
  label="Start date"
  formControlName="startDate"
  [min]="today"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900', description: 'Border mix and focus' },
    { name: '--lz-color-neutral-400', description: 'Placeholder text' },
    { name: '--lz-shadow-dropdown', description: 'Calendar popover shadow' },
  ],
};
