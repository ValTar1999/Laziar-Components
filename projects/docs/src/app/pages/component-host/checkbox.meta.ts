import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_CHECKBOX_TYPES, LZ_CHECKBOX_VARIANTS } from '@laziar/components';

export const CHECKBOX_COMPONENT_META: DocsComponentMeta = {
  name: 'Checkbox',
  selector: 'lz-checkbox',
  description: 'Чекбокс и радиокнопка с заголовком, описанием и состояниями ошибки.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Принять',
    },
    {
      name: 'type',
      kind: 'select',
      options: [...LZ_CHECKBOX_TYPES],
      default: 'checkbox',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...LZ_CHECKBOX_VARIANTS],
      default: 'default',
    },
    {
      name: 'checked',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'indeterminate',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'rounded',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'description',
      kind: 'string',
      default: '',
    },
  ],
  variants: [
    {
      label: 'checkbox · default',
      props: { type: 'checkbox', variant: 'default', checked: false, title: 'Принять' },
    },
    {
      label: 'checkbox · checked',
      props: { type: 'checkbox', variant: 'default', checked: true, title: 'Принять' },
    },
    {
      label: 'checkbox · error',
      props: { type: 'checkbox', variant: 'error', checked: false, title: 'Обязательно' },
    },
    {
      label: 'radio · rounded',
      props: {
        type: 'radio',
        variant: 'default',
        checked: true,
        rounded: true,
        title: 'Вариант A',
      },
    },
    {
      label: 'checkbox · indeterminate',
      props: {
        type: 'checkbox',
        variant: 'default',
        checked: false,
        indeterminate: true,
        title: 'Выбрать всё',
      },
    },
    {
      label: 'checkbox · disabled',
      props: {
        type: 'checkbox',
        variant: 'default',
        checked: true,
        disabled: true,
        title: 'Недоступно',
      },
    },
  ],
  inputs: [
    {
      name: 'type',
      type: `'checkbox' | 'radio'`,
      default: `'checkbox'`,
      description: 'Нативный тип input',
    },
    {
      name: 'variant',
      type: `'default' | 'error'`,
      default: `'default'`,
      description: 'Визуальное состояние валидации',
    },
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description: 'Отмечен ли элемент',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает взаимодействие',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Промежуточное состояние (только checkbox)',
    },
    {
      name: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Скруглённый вид (часто с radio)',
    },
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Заголовок / label',
    },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Подпись под заголовком',
    },
  ],
  outputs: [
    {
      name: 'checkedChange',
      type: 'OutputEmitterRef<boolean>',
      description: 'Изменение checked при клике',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Согласие',
      code: `<lz-checkbox
  title="Принимаю условия"
  description="Можно отозвать в настройках"
  [checked]="accepted"
  (checkedChange)="accepted = $event"
/>`,
    },
    {
      title: 'Радиогруппа',
      code: `<lz-checkbox type="radio" rounded title="Опция A" [checked]="value === 'a'" />
<lz-checkbox type="radio" rounded title="Опция B" [checked]="value === 'b'" />`,
    },
  ],
  tokens: [
    { name: '--lz-checkbox-border', description: 'Цвет рамки' },
    { name: '--lz-checkbox-bg-checked', description: 'Фон в checked' },
    { name: '--lz-checkbox-error', description: 'Акцент variant=error' },
  ],
};
