import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_INPUT_APPEARANCES, LZ_INPUT_SIZES, LZ_INPUT_TYPES } from '@laziar/components';

export const INPUT_COMPONENT_META: DocsComponentMeta = {
  name: 'InputComponent',
  selector: 'lz-input',
  description: 'Текстовое поле с label, helper, кнопкой и вариантами appearance.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Email',
    },
    {
      name: 'placeholder',
      kind: 'string',
      default: 'you@example.com',
    },
    {
      name: 'type',
      kind: 'select',
      options: [...LZ_INPUT_TYPES],
      default: 'text',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_INPUT_SIZES],
      default: 'lg',
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
      name: 'pill',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'appearance',
      kind: 'select',
      options: [...LZ_INPUT_APPEARANCES],
      default: 'default',
    },
    {
      name: 'prefix',
      kind: 'string',
      default: '',
    },
    {
      name: 'buttonLabel',
      kind: 'string',
      default: '',
    },
    {
      name: 'withButton',
      kind: 'select',
      options: ['', 'left', 'right'],
      default: '',
      description: 'Пустая строка → null (без кнопки)',
    },
    {
      name: 'iconButton',
      kind: 'string',
      default: '',
    },
  ],
  variants: [
    {
      label: 'default · lg',
      props: { label: 'Email', type: 'email', size: 'lg', placeholder: 'you@example.com' },
    },
    {
      label: 'search · pill',
      props: { label: '', type: 'search', size: 'md', placeholder: 'Поиск', pill: true },
    },
    {
      label: 'error',
      props: {
        label: 'Email',
        type: 'email',
        size: 'lg',
        error: true,
        helperText: 'Некорректный email',
      },
    },
    {
      label: 'with button',
      props: {
        label: 'Код',
        type: 'text',
        size: 'md',
        withButton: 'right',
        buttonLabel: 'Отправить',
      },
    },
    {
      label: 'laziarPanel',
      props: {
        label: '',
        type: 'search',
        size: 'md',
        appearance: 'laziarPanel',
        placeholder: 'Найти…',
      },
    },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: "''",
      description: 'Подпись над полем',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Placeholder',
    },
    {
      name: 'type',
      type: `'text' | 'email' | 'password' | 'search'`,
      default: `'text'`,
      description: 'Тип input',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'lg'`,
      description: 'Размер поля',
    },
    {
      name: 'helperText',
      type: 'string',
      default: "''",
      description: 'Подсказка / ошибка под полем',
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
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Полное скругление',
    },
    {
      name: 'appearance',
      type: `'default' | 'laziarPanel'`,
      default: `'default'`,
      description: 'Визуальный стиль',
    },
    {
      name: 'prefix',
      type: 'string',
      default: "''",
      description: 'Префикс слева в поле',
    },
    {
      name: 'withButton',
      type: `'left' | 'right' | null`,
      default: 'null',
      description: 'Позиция встроенной кнопки',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      default: "''",
      description: 'Текст кнопки',
    },
    {
      name: 'iconButton',
      type: 'string',
      default: 'undefined',
      description: 'Иконка вместо текста кнопки',
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
      code: `<lz-input
  label="Email"
  type="email"
  [(ngModel)]="email"
  helperText="Мы не передаём адрес третьим лицам"
/>`,
    },
    {
      title: 'Поиск',
      code: `<lz-input type="search" pill placeholder="Поиск" [(ngModel)]="q" />`,
    },
  ],
  tokens: [
    { name: '--lz-input-border', description: 'Цвет рамки' },
    { name: '--lz-input-bg', description: 'Фон поля' },
    { name: '--lz-input-error', description: 'Акцент ошибки' },
  ],
};
