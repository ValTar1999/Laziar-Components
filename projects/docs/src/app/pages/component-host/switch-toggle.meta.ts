import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_SWITCH_TOGGLE_SIZES } from '@laziar/components';

export const SWITCH_TOGGLE_COMPONENT_META: DocsComponentMeta = {
  name: 'SwitchToggle',
  selector: 'lz-switch-toggle',
  description: 'Переключатель вкл/выкл с размерами sm и md.',
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
      description: 'Состояние вкл',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает переключение',
    },
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'md'`,
      description: 'Размер переключателя',
    },
  ],
  outputs: [
    {
      name: 'changed',
      type: 'OutputEmitterRef<boolean>',
      description: 'Новое значение active после клика',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Настройка',
      code: `<lz-switch-toggle
  [active]="notifications"
  (changed)="notifications = $event"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-switch-toggle-track-active', description: 'Фон трека во вкл' },
    { name: '--lz-switch-toggle-thumb', description: 'Цвет ползунка' },
  ],
};
