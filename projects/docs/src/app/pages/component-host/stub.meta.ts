import { DocsComponentMeta } from '../../core/component-doc.model';

/** Placeholder component page used to validate the docs layout. */
export const STUB_COMPONENT_META: DocsComponentMeta = {
  name: 'Stub',
  selector: 'lz-stub',
  description:
    'Заглушка для проверки каркаса документации: превью, песочница, синхронизированный код, варианты, API и токены.',
  contentFrom: 'label',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost'],
      default: 'primary',
      description: 'Визуальный вариант',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      default: 'md',
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'label',
      kind: 'string',
      default: 'Нажми меня',
    },
    {
      name: 'accent',
      kind: 'color',
      default: '#d50b0b',
      description: 'Локальный акцент (демо color picker)',
    },
    {
      name: 'maxWidth',
      kind: 'number',
      default: 280,
      description: 'Максимальная ширина в px',
    },
  ],
  variants: [
    {
      label: 'primary · sm',
      props: {
        variant: 'primary',
        size: 'sm',
        disabled: false,
        label: 'Primary sm',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'primary · md',
      props: {
        variant: 'primary',
        size: 'md',
        disabled: false,
        label: 'Primary md',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'primary · lg',
      props: {
        variant: 'primary',
        size: 'lg',
        disabled: false,
        label: 'Primary lg',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'secondary · md',
      props: {
        variant: 'secondary',
        size: 'md',
        disabled: false,
        label: 'Secondary',
        accent: '#0d56e7',
        maxWidth: 280,
      },
    },
    {
      label: 'ghost · md',
      props: {
        variant: 'ghost',
        size: 'md',
        disabled: false,
        label: 'Ghost',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
    {
      label: 'primary · disabled',
      props: {
        variant: 'primary',
        size: 'md',
        disabled: true,
        label: 'Disabled',
        accent: '#d50b0b',
        maxWidth: 280,
      },
    },
  ],
  inputs: [
    {
      name: 'variant',
      type: `'primary' | 'secondary' | 'ghost'`,
      default: `'primary'`,
      description: 'Визуальный стиль кнопки',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Размер',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает взаимодействие',
    },
    {
      name: 'label',
      type: 'string',
      default: `'Нажми меня'`,
      description: 'Текст (в реальном API будет через ng-content)',
    },
    {
      name: 'accent',
      type: 'string',
      default: `'#d50b0b'`,
      description: 'Демо-цвет для color picker',
    },
    {
      name: 'maxWidth',
      type: 'number',
      default: '280',
      description: 'Ограничение ширины',
    },
  ],
  outputs: [
    {
      name: 'pressed',
      type: 'EventEmitter<void>',
      description: 'Клик по кнопке (когда не disabled)',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Содержимое кнопки (иконка + текст)',
    },
    {
      name: '[lzPrefix]',
      description: 'Слот слева от текста',
    },
  ],
  deprecated: [
    {
      name: 'type',
      type: `'primary' | 'secondary'`,
      replacedBy: 'variant',
      description: 'Старое имя варианта из публикатора',
    },
    {
      name: 'btnSize',
      type: `'sm' | 'md' | 'lg'`,
      replacedBy: 'size',
      description: 'Устаревший алиас размера',
    },
  ],
  examples: [
    {
      title: 'В форме',
      description: 'Primary-кнопка сабмита рядом с secondary cancel.',
      code: `<form (ngSubmit)="save()">
  <lz-stub variant="secondary" size="md">Отмена</lz-stub>
  <lz-stub variant="primary" size="md">Сохранить</lz-stub>
</form>`,
    },
    {
      title: 'В модалке',
      description: 'Футер диалога с выравниванием вправо.',
      code: `<lz-modal>
  <p>Удалить запись?</p>
  <footer>
    <lz-stub variant="ghost">Отмена</lz-stub>
    <lz-stub variant="primary">Удалить</lz-stub>
  </footer>
</lz-modal>`,
    },
  ],
  tokens: [
    {
      name: '--lz-color-primary',
      description: 'Заливка primary-варианта',
    },
    {
      name: '--lz-color-secondary',
      description: 'Заливка secondary-варианта',
    },
    {
      name: '--lz-radius-md',
      description: 'Скругление кнопки',
    },
    {
      name: '--lz-duration-fast',
      description: 'Длительность hover/focus transition',
    },
    {
      name: '--lz-shadow-focus',
      description: 'Кольцо фокуса',
    },
  ],
};
