import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_RADIO_GROUP_APPEARANCES, LZ_RADIO_GROUP_ORIENTATIONS } from '@laziar/components';

export const RADIO_GROUP_COMPONENT_META: DocsComponentMeta = {
  name: 'RadioGroup',
  selector: 'lz-radio-group',
  description:
    'Mutually exclusive options on native radios: one Tab stop, arrow keys move the choice. Plain or card appearance, with optional icon and description per option.',
  controls: [
    {
      name: 'appearance',
      kind: 'select',
      options: [...LZ_RADIO_GROUP_APPEARANCES],
      default: 'plain',
    },
    {
      name: 'orientation',
      kind: 'select',
      options: [...LZ_RADIO_GROUP_ORIENTATIONS],
      default: 'vertical',
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: [
    { label: 'plain', props: { appearance: 'plain', orientation: 'vertical' } },
    { label: 'plain · horizontal', props: { appearance: 'plain', orientation: 'horizontal' } },
    { label: 'card', props: { appearance: 'card', orientation: 'vertical' } },
    { label: 'disabled', props: { appearance: 'plain', disabled: true } },
  ],
  inputs: [
    {
      name: 'options',
      type: 'readonly LzRadioOption[]',
      default: '[]',
      description: 'Choices: { value, label, description?, icon?, disabled? }',
    },
    {
      name: 'value',
      type: 'unknown',
      default: 'null',
      description:
        'The chosen option value (compared with ===); also settable through ngModel / formControl',
    },
    {
      name: 'name',
      type: 'string | undefined',
      default: 'generated',
      description: 'The radios’ shared name',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Group name when no visible heading names it',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Id of the visible heading that names the group',
    },
    {
      name: 'appearance',
      type: `'plain' | 'card'`,
      default: `'plain'`,
      description: 'Bare radios, or each option as a bordered card',
    },
    {
      name: 'orientation',
      type: `'vertical' | 'horizontal'`,
      default: `'vertical'`,
      description: 'Which way the options run',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables every option',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'OutputEmitterRef<unknown>',
      description: 'The value of the option just chosen',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'With ngModel',
      code: `<h2 id="mode-heading">Delivery mode</h2>
<lz-radio-group
  appearance="card"
  ariaLabelledBy="mode-heading"
  [options]="[
    { value: 'even', label: 'Evenly', icon: 'play', description: 'Spread over the flight' },
    { value: 'fast', label: 'As fast as possible', icon: 'bolt' }
  ]"
  [(ngModel)]="mode"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900', description: 'Checked border and dot' },
    { name: '--lz-color-neutral-200', description: 'Unchecked border' },
  ],
};
