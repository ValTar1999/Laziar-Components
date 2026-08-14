import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_BUTTON_SIZES } from '@laziar/components';

const demos = ['segmented', 'icons', 'split', 'stepper', 'download', 'dates'] as const;

export const BUTTON_GROUP_COMPONENT_META: DocsComponentMeta = {
  name: 'ButtonGroup',
  selector: 'lz-button-group',
  description:
    'Wrapper for a segmented button group: shared border, edge rounding, and optional dividers (line). Compositions match Figma Button Group (Playground).',
  controls: [
    {
      name: 'demo',
      kind: 'select',
      options: [...demos],
      default: 'segmented',
      description: 'Composition from Button Group (Playground)',
    },
    {
      name: 'line',
      kind: 'boolean',
      default: true,
      description: 'Dividers between buttons',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_BUTTON_SIZES],
      default: 'md',
    },
  ],
  variants: [
    {
      label: 'segmented · pill',
      props: { demo: 'segmented', line: true, size: 'md' },
      code: `<lz-button-group [line]="true">
  <lz-button label="Day" variant="outline" color="gray" pill />
  <lz-button label="Month" variant="outline" color="gray" pill />
  <lz-button label="Year" variant="outline" color="gray" pill />
</lz-button-group>`,
    },
    {
      label: 'icons',
      props: { demo: 'icons', line: true, size: 'md' },
      code: `<lz-button-group [line]="true">
  <lz-button variant="outline" color="gray" icon="italic" ariaLabel="Italic" />
  <lz-button variant="outline" color="gray" icon="bold" ariaLabel="Bold" />
  <lz-button variant="outline" color="gray" icon="underline" ariaLabel="Underline" />
</lz-button-group>`,
    },
    {
      label: 'split',
      props: { demo: 'split', line: true, size: 'md' },
      code: `<lz-button-group [line]="true">
  <lz-button label="Last 7 days" variant="outline" color="gray" />
  <lz-button variant="outline" color="gray" icon="chevron-down" ariaLabel="Open" />
</lz-button-group>`,
    },
    {
      label: 'stepper',
      props: { demo: 'stepper', line: true, size: 'md' },
      code: `<lz-button-group [line]="true">
  <lz-button variant="outline" color="gray" icon="minus" ariaLabel="Decrease" />
  <lz-button variant="outline" color="gray" icon="plus" ariaLabel="Increase" />
</lz-button-group>`,
    },
    {
      label: 'download',
      props: { demo: 'download', line: true, size: 'md' },
      code: `<lz-button-group [line]="true">
  <lz-button label="Download for free" variant="outline" color="gray" />
  <lz-button label="50k" variant="outline" color="gray" />
</lz-button-group>`,
    },
    {
      label: 'dates',
      props: { demo: 'dates', line: true, size: 'md' },
      code: `<lz-button-group [line]="true">
  <lz-button label="01/01/2021" variant="outline" color="gray" icon="calendar" iconPosition="left" />
  <lz-button label="05/01/2021" variant="outline" color="gray" icon="calendar" iconPosition="left" />
</lz-button-group>`,
    },
  ],
  inputs: [
    {
      name: 'line',
      type: 'boolean',
      default: 'false',
      description: 'Show dividers between child buttons',
    },
    {
      name: 'divided',
      type: 'boolean',
      default: 'false',
      description: '@deprecated — alias of line',
    },
  ],
  outputs: [],
  slots: [
    {
      name: '(default)',
      description: 'Child lz-button elements (or native button)',
    },
  ],
  deprecated: [
    {
      name: 'divided',
      type: 'boolean',
      replacedBy: 'line',
      description: 'Old divider name',
    },
  ],
  examples: [
    {
      title: 'Segmented switch',
      code: `<lz-button-group [line]="true">
  <lz-button label="Day" variant="outline" color="gray" pill />
  <lz-button label="Month" variant="outline" color="gray" pill />
  <lz-button label="Year" variant="outline" color="gray" pill />
</lz-button-group>`,
    },
    {
      title: 'Icons only',
      code: `<lz-button-group [line]="true">
  <lz-button variant="outline" color="gray" icon="italic" ariaLabel="Italic" />
  <lz-button variant="outline" color="gray" icon="bold" ariaLabel="Bold" />
  <lz-button variant="outline" color="gray" icon="underline" ariaLabel="Underline" />
</lz-button-group>`,
    },
    {
      title: 'Split with chevron',
      code: `<lz-button-group [line]="true">
  <lz-button label="Last 7 days" variant="outline" color="gray" />
  <lz-button variant="outline" color="gray" icon="chevron-down" ariaLabel="Open" />
</lz-button-group>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900 / 10%', description: 'Group border and dividers' },
    { name: '--lz-color-background', description: 'Group background (#FFFFFA)' },
  ],
  snippetIgnore: ['demo', 'size'],
};
