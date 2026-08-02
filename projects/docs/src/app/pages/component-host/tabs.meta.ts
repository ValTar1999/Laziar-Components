import { DocsComponentMeta } from '../../core/component-doc.model';

const styles = ['outline', 'underline', 'border'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export const TABS_COMPONENT_META: DocsComponentMeta = {
  name: 'Tabs',
  selector: 'lz-tabs',
  description:
    'Горизонтальный таб-лист: стили outline / underline / border, размеры и активный индекс. Поддерживает badges, icons и disabled-вкладки.',
  controls: [
    {
      name: 'style',
      kind: 'select',
      options: [...styles],
      default: 'outline',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...sizes],
      default: 'md',
    },
    {
      name: 'activeTab',
      kind: 'number',
      default: 0,
      description: 'Индекс активной вкладки (one-way в песочнице)',
    },
  ],
  variants: [
    { label: 'outline · md', props: { style: 'outline', size: 'md', activeTab: 0 } },
    { label: 'underline · md', props: { style: 'underline', size: 'md', activeTab: 1 } },
    { label: 'border · md', props: { style: 'border', size: 'md', activeTab: 0 } },
    { label: 'outline · sm', props: { style: 'outline', size: 'sm', activeTab: 0 } },
    { label: 'underline · lg', props: { style: 'underline', size: 'lg', activeTab: 2 } },
    { label: 'border · lg', props: { style: 'border', size: 'lg', activeTab: 1 } },
  ],
  inputs: [
    {
      name: 'tabs',
      type: 'string[]',
      default: '[]',
      description: 'Подписи вкладок',
    },
    {
      name: 'style',
      type: `'outline' | 'underline' | 'border'`,
      default: `'outline'`,
      description: 'Визуальный стиль таб-листа',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Размер (паддинги вкладок)',
    },
    {
      name: 'activeTab',
      type: 'number (model)',
      default: '0',
      description: 'Двусторонний индекс активной вкладки',
    },
    {
      name: 'badges',
      type: '(LzTabBadge | null)[]',
      default: '[]',
      description: 'Опциональные бейджи по индексу вкладки',
    },
    {
      name: 'icons',
      type: 'string[]',
      default: '[]',
      description: 'Имена иконок (lz-icon) по индексу',
    },
    {
      name: 'disabledTabIndexes',
      type: 'number[]',
      default: '[]',
      description: 'Индексы недоступных вкладок',
    },
    {
      name: 'disabledTabTooltips',
      type: 'Record<string, string>',
      default: '{}',
      description: 'Тултипы для disabled-вкладок (ключ — индекс строкой)',
    },
    {
      name: 'disabledTabTooltipTrigger',
      type: `'hover' | 'click'`,
      default: `'hover'`,
      description: 'Триггер тултипа на disabled-вкладке',
    },
    {
      name: 'class',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Доп. класс на корне',
    },
  ],
  outputs: [
    {
      name: 'activeTab',
      type: 'ModelSignal<number>',
      description: 'Изменение активного индекса (model)',
    },
  ],
  slots: [],
  examples: [
    {
      title: 'Базовый таб-лист',
      code: `<lz-tabs
  [tabs]="['Обзор', 'Участники', 'Настройки']"
  style="underline"
  size="md"
  [(activeTab)]="active"
/>`,
    },
    {
      title: 'С иконками и бейджами',
      code: `<lz-tabs
  [tabs]="labels"
  [icons]="['home', 'users', 'cog-6-tooth']"
  [badges]="[{ text: '3', variant: 'red' }, null, null]"
  style="border"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-color-gray-*', description: 'Текст вкладок и разделители' },
    { name: '--lz-duration-normal', description: 'Transition цвета / индикатора' },
    { name: '--lz-radius-md', description: 'Скругление стиля border' },
  ],
};
