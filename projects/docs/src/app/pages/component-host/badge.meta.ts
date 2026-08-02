import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_BADGE_COLORS, LZ_BADGE_SIZES } from '@laziar/components';

const BADGE_COLORS = LZ_BADGE_COLORS.filter((c) => c !== 'magrnta');

export const BADGE_COMPONENT_META: DocsComponentMeta = {
  name: 'Badge',
  selector: 'lz-badge',
  description:
    'Компактный чип/метка со цветовой палитрой, размерами, pill-формой и опциональной иконкой.',
  contentFrom: 'label',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Badge',
      description: 'Projected-контент (ng-content)',
    },
    {
      name: 'color',
      kind: 'select',
      options: [...BADGE_COLORS],
      default: 'gray',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_BADGE_SIZES],
      default: 'sm',
    },
    {
      name: 'border',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'pill',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'icon',
      kind: 'string',
      default: '',
      description: 'Имя lz-icon; пусто — без иконки',
    },
    {
      name: 'iconPosition',
      kind: 'select',
      options: ['left', 'right'],
      default: 'left',
    },
    {
      name: 'iconVariant',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro'],
      default: 'solid',
    },
  ],
  variants: [
    ...BADGE_COLORS.slice(0, 6).map((color) => ({
      label: color,
      props: {
        label: color,
        color,
        size: 'sm',
        border: false,
        pill: false,
        disabled: false,
        icon: '',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    })),
    {
      label: 'pill · border · icon',
      props: {
        label: 'New',
        color: 'green',
        size: 'md',
        border: true,
        pill: true,
        disabled: false,
        icon: 'check',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    },
    {
      label: 'disabled',
      props: {
        label: 'Off',
        color: 'gray',
        size: 'sm',
        border: false,
        pill: false,
        disabled: true,
        icon: '',
        iconPosition: 'left',
        iconVariant: 'solid',
      },
    },
  ],
  inputs: [
    {
      name: 'color',
      type: `'green' | 'red' | 'purple' | 'yellow' | 'blue' | 'orange' | 'magenta' | 'teal' | 'gray' | 'violet'`,
      default: `'gray'`,
      description: 'Цветовая тема (есть alias magrnta → magenta)',
    },
    {
      name: 'size',
      type: `'lg' | 'md' | 'sm'`,
      default: `'sm'`,
      description: 'Размер бейджа',
    },
    {
      name: 'border',
      type: 'boolean',
      default: 'false',
      description: 'Рамка (border ring)',
    },
    {
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Полностью скруглённая форма',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Неактивное состояние',
    },
    {
      name: 'icon',
      type: 'string',
      default: 'undefined',
      description: 'Имя иконки; кастом — слот [lzBadgeIcon]',
    },
    {
      name: 'iconPosition',
      type: `'left' | 'right'`,
      default: `'left'`,
      description: 'Позиция иконки',
    },
    {
      name: 'iconVariant',
      type: `'outline' | 'solid' | 'mini' | 'micro'`,
      default: `'solid'`,
      description: 'Вариант спрайта lz-icon',
    },
    {
      name: 'img',
      type: 'string',
      default: 'undefined',
      description: 'URL изображения слева',
    },
    {
      name: 'iconClickable',
      type: 'boolean',
      default: 'false',
      description: 'Иконка кликабельна и эмитит iconClick',
    },
    {
      name: 'iconAriaLabel',
      type: 'string',
      default: "''",
      description: 'aria-label для кликабельной иконки',
    },
  ],
  outputs: [
    {
      name: 'iconClick',
      type: 'OutputEmitterRef<void>',
      description: 'Клик по иконке (если iconClickable)',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Текст / контент бейджа',
    },
    {
      name: '[lzBadgeIcon]',
      description: 'Кастомная иконка вместо lz-icon по имени',
    },
  ],
  examples: [
    {
      title: 'Статус',
      code: `<lz-badge color="green" pill>Active</lz-badge>`,
    },
    {
      title: 'С иконкой',
      code: `<lz-badge color="blue" icon="check" iconPosition="left">Verified</lz-badge>`,
    },
    {
      title: 'С рамкой',
      code: `<lz-badge color="purple" [border]="true" size="md">Pro</lz-badge>`,
    },
  ],
  tokens: [
    { name: '--lz-badge-50 / 100 / 200 / 500 / 600 / 900', description: 'Нейтральная шкала gray' },
    { name: '--lz-green-* / --lz-red-* / …', description: 'Палитры цветов бейджа' },
    { name: '--lz-icon-size', description: 'Размер иконки внутри бейджа' },
  ],
};
