import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_SELECT_SIZES } from '@laziar/components';

export const SELECT_COMPONENT_META: DocsComponentMeta = {
  name: 'SelectComponent',
  selector: 'lz-select',
  description: 'Выпадающий список с label, размерами sm/md и helper-текстом.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Выберите опцию',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'Выберите…',
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
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: [
    {
      label: 'md · default',
      props: { label: 'Выберите опцию', size: 'md', placeholder: 'Выберите…' },
    },
    {
      label: 'sm',
      props: { label: 'Размер sm', size: 'sm', placeholder: '…' },
    },
    {
      label: 'with helper',
      props: {
        label: 'Город',
        size: 'md',
        helperText: 'Можно изменить позже',
      },
    },
    {
      label: 'disabled',
      props: { label: 'Недоступно', size: 'md', disabled: true },
    },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Подпись над полем',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: `'Select...'`,
      description: 'Текст, когда ничего не выбрано',
    },
    {
      name: 'options',
      type: 'LzSelectOptionType[]',
      default: '[]',
      description: 'Список опций (string | { id, title, date })',
    },
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'md'`,
      description: 'Размер контрола',
    },
    {
      name: 'helperText',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Подсказка под полем',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает select',
    },
  ],
  outputs: [
    {
      name: 'opened',
      type: 'OutputEmitterRef<void>',
      description: 'Срабатывает при открытии списка',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'С ngModel',
      code: `<lz-select
  label="Опция"
  [options]="['A', 'B', 'C']"
  [(ngModel)]="value"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-select-border', description: 'Цвет рамки' },
    { name: '--lz-select-bg', description: 'Фон триггера' },
  ],
};
