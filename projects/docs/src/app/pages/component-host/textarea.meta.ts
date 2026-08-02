import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_TEXTAREA_RESIZE } from '@laziar/components';

export const TEXTAREA_COMPONENT_META: DocsComponentMeta = {
  name: 'TextareaComponent',
  selector: 'lz-textarea',
  description: 'Многострочное поле с label, helper и настройкой resize.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Комментарий',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'Введите текст…',
    },
    {
      name: 'rows',
      kind: 'number',
      default: 4,
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
      name: 'resize',
      kind: 'select',
      options: [...LZ_TEXTAREA_RESIZE],
      default: 'vertical',
    },
  ],
  variants: [
    {
      label: 'default · vertical',
      props: { label: 'Комментарий', rows: 4, resize: 'vertical' },
    },
    {
      label: 'error',
      props: {
        label: 'Комментарий',
        rows: 3,
        error: true,
        helperText: 'Обязательное поле',
      },
    },
    {
      label: 'resize none',
      props: { label: 'Фиксированный', rows: 4, resize: 'none' },
    },
    {
      label: 'disabled',
      props: { label: 'Только чтение', rows: 3, disabled: true },
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
      default: "''",
      description: 'Placeholder',
    },
    {
      name: 'rows',
      type: 'number',
      default: '4',
      description: 'Число видимых строк',
    },
    {
      name: 'helperText',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Подсказка / ошибка',
    },
    {
      name: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Состояние ошибки',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает поле',
    },
    {
      name: 'resize',
      type: `'none' | 'vertical' | 'horizontal' | 'both'`,
      default: `'vertical'`,
      description: 'Поведение resize',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'OutputEmitterRef<string>',
      description: 'Изменение значения',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'С ngModel',
      code: `<lz-textarea
  label="Описание"
  [rows]="5"
  [(ngModel)]="description"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-textarea-border', description: 'Цвет рамки' },
    { name: '--lz-textarea-bg', description: 'Фон' },
  ],
};
