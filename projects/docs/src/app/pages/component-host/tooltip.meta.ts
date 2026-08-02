import { DocsComponentMeta } from '../../core/component-doc.model';

const TOOLTIP_POSITIONS = [
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;

export const TOOLTIP_COMPONENT_META: DocsComponentMeta = {
  name: 'Tooltip',
  selector: 'lz-tooltip',
  description:
    'Обёртка над тегом/элементом: CDK Overlay панель по hover или click. Алиас: `lz-tooltip-hover`.',
  controls: [
    {
      name: 'title',
      kind: 'string',
      default: 'Заголовок',
    },
    {
      name: 'text',
      kind: 'string',
      default: 'Текст подсказки',
    },
    {
      name: 'position',
      kind: 'select',
      options: [...TOOLTIP_POSITIONS],
      default: 'top',
    },
    {
      name: 'theme',
      kind: 'select',
      options: ['dark', 'light'],
      default: 'dark',
    },
    {
      name: 'arrow',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'trigger',
      kind: 'select',
      options: ['hover', 'click'],
      default: 'hover',
    },
  ],
  variants: [
    {
      label: 'hover · top',
      props: {
        title: 'Заголовок',
        text: 'Текст подсказки',
        position: 'top',
        theme: 'dark',
        arrow: false,
        disabled: false,
        trigger: 'hover',
      },
    },
    {
      label: 'click · arrow',
      props: {
        title: 'Клик',
        text: 'Открывается по клику',
        position: 'bottom',
        theme: 'dark',
        arrow: true,
        disabled: false,
        trigger: 'click',
      },
    },
    {
      label: 'light · top-right',
      props: {
        title: 'Светлая',
        text: 'Тема light',
        position: 'top-right',
        theme: 'light',
        arrow: true,
        disabled: false,
        trigger: 'hover',
      },
    },
  ],
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Заголовок панели',
    },
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'Текст панели',
    },
    {
      name: 'img',
      type: 'string',
      default: "''",
      description: 'URL изображения в панели',
    },
    {
      name: 'position',
      type: `'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`,
      default: `'top'`,
      description: 'Позиция CDK overlay',
    },
    {
      name: 'theme',
      type: `'dark' | 'light'`,
      default: `'dark'`,
      description: 'Тема панели',
    },
    {
      name: 'arrow',
      type: 'boolean',
      default: 'false',
      description: 'Показать стрелку',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает открытие',
    },
    {
      name: 'trigger',
      type: `'hover' | 'click'`,
      default: `'hover'`,
      description: 'Способ открытия',
    },
    {
      name: 'triggerClass',
      type: 'string',
      default: 'undefined',
      description: 'Класс обёртки триггера',
    },
  ],
  outputs: [],
  slots: [
    {
      name: '(default)',
      description: 'Триггер — кнопка, иконка, ссылка и т.д.',
    },
  ],
  examples: [
    {
      title: 'Hover',
      code: `<lz-tooltip title="Профиль" text="Открыть настройки" position="top">
  <button type="button">Наведи</button>
</lz-tooltip>`,
    },
    {
      title: 'Click + стрелка',
      code: `<lz-tooltip
  trigger="click"
  [arrow]="true"
  title="Меню"
  text="Доп. действия"
>
  <button type="button">Открыть</button>
</lz-tooltip>`,
    },
  ],
  tokens: [
    { name: 'CDK Overlay pane', description: 'Класс lz-tooltip-cdk-pane' },
    {
      name: 'data-panel-theme',
      description: 'Тема панели dark / light (не путать с data-theme приложения)',
    },
  ],
};
