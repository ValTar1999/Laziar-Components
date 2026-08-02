import { DocsComponentMeta } from '../../core/component-doc.model';
import { AlertVariants } from '@laziar/components';

export const ALERT_COMPONENT_META: DocsComponentMeta = {
  name: 'Alert',
  selector: 'lz-alert',
  description:
    'Баннер уведомления с иконкой, заголовком, текстом и опциональной кнопкой закрытия. Поддерживает семантические варианты и горизонтальную раскладку.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Успешно',
    },
    {
      name: 'text',
      kind: 'string',
      default: 'Изменения сохранены.',
    },
    {
      name: 'iconName',
      kind: 'string',
      default: 'check-circle',
      description: 'Имя символа lz-icon',
    },
    {
      name: 'iconVariant',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro', 'custom'],
      default: 'outline',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...AlertVariants],
      default: 'default',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['base', 'sm'],
      default: 'sm',
    },
    {
      name: 'padding',
      kind: 'select',
      options: ['p-3', 'p-4'],
      default: 'p-4',
    },
    {
      name: 'isRow',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'isRowtext',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'showCloseButton',
      kind: 'boolean',
      default: true,
    },
  ],
  variants: AlertVariants.map((variant) => ({
    label: variant,
    props: {
      variant,
      title: variant,
      text: 'Краткое сообщение',
      iconName: 'check-circle',
      iconVariant: 'outline',
      size: 'sm',
      padding: 'p-4',
      isRow: false,
      isRowtext: false,
      showCloseButton: true,
    },
  })),
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: `'Alert title'`,
      description: 'Заголовок баннера',
    },
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'Основной текст',
    },
    {
      name: 'iconName',
      type: 'string',
      default: `'check-circle'`,
      description: 'Имя иконки lz-icon',
    },
    {
      name: 'iconVariant',
      type: `'outline' | 'solid' | 'mini' | 'micro' | 'custom'`,
      default: `'outline'`,
      description: 'Вариант спрайта иконки',
    },
    {
      name: 'variant',
      type: `'default' | 'gray' | 'warning' | 'error' | 'success' | 'info' | 'purple' | 'dark' | 'red'`,
      default: `'default'`,
      description: 'Семантический / цветовой вариант',
    },
    {
      name: 'size',
      type: `'base' | 'sm'`,
      default: `'sm'`,
      description: 'Типографический размер',
    },
    {
      name: 'padding',
      type: `'p-3' | 'p-4'`,
      default: `'p-4'`,
      description: 'Внутренние отступы',
    },
    {
      name: 'isRow',
      type: 'boolean',
      default: 'false',
      description: 'Горизонтальная раскладка контента',
    },
    {
      name: 'isRowtext',
      type: 'boolean',
      default: 'false',
      description: 'Заголовок и текст в одну строку',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: 'true',
      description: 'Показать кнопку закрытия',
    },
    {
      name: 'closeColor',
      type: `'gray' | 'yellow' | 'red' | 'green' | 'blue' | 'purple'`,
      default: 'undefined',
      description: 'Переопределение цвета кнопки закрытия',
    },
    {
      name: 'buttonVariant',
      type: `'primary' | 'outline' | 'secondary' | 'tertiary' | 'link'`,
      default: 'undefined',
      description: 'Переопределение варианта кнопки закрытия',
    },
  ],
  outputs: [
    {
      name: 'closed',
      type: 'OutputEmitterRef<void>',
      description: 'Клик по кнопке закрытия',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Доп. контент в теле алерта (рядом с текстом)',
    },
  ],
  examples: [
    {
      title: 'Успех',
      code: `<lz-alert
  variant="success"
  title="Готово"
  text="Профиль обновлён"
  iconName="check-circle"
/>`,
    },
    {
      title: 'Ошибка без закрытия',
      code: `<lz-alert
  variant="error"
  title="Ошибка"
  text="Не удалось сохранить"
  [showCloseButton]="false"
/>`,
    },
    {
      title: 'Строка',
      code: `<lz-alert
  variant="info"
  title="Подсказка"
  text="Можно продолжить"
  [isRow]="true"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-primary / secondary / …', description: 'Семантические палитры вариантов' },
    { name: '--lz-radius-*', description: 'Скругление контейнера' },
    { name: '--lz-font-size-*', description: 'Типографика title / text по size' },
  ],
};
