import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_SWITCH_TOGGLE_SIZES } from '@laziar/components';

export const SWITCH_TOGGLE_COMPONENT_META: DocsComponentMeta = {
  name: 'SwitchToggle',
  selector: 'lz-switch-toggle',
  description: 'On/off toggle with sm and md sizes.',
  controls: [
    {
      name: 'active',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_SWITCH_TOGGLE_SIZES],
      default: 'md',
    },
  ],
  variants: [
    {
      label: 'md · off',
      props: { active: false, disabled: false, size: 'md' },
    },
    {
      label: 'md · on',
      props: { active: true, disabled: false, size: 'md' },
    },
    {
      label: 'sm · off',
      props: { active: false, disabled: false, size: 'sm' },
    },
    {
      label: 'sm · on',
      props: { active: true, disabled: false, size: 'sm' },
    },
    {
      label: 'md · disabled',
      props: { active: true, disabled: true, size: 'md' },
    },
  ],
  inputs: [
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      description: 'On state',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables toggling',
    },
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'md'`,
      description: 'Toggle size',
    },
  ],
  outputs: [
    {
      name: 'changed',
      type: 'OutputEmitterRef<boolean>',
      description: 'New active value after click',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Setting',
      code: `<lz-switch-toggle
  [active]="notifications"
  (changed)="notifications = $event"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-900', description: 'Track in the on state' },
    { name: '--lz-color-neutral-100', description: 'Track in the off state' },
    { name: '--lz-color-text-inverse', description: 'Thumb color (#FFFFFA)' },
  ],
};
