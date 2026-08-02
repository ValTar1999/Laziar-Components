import { DocsComponentMeta } from '../../core/component-doc.model';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['solid', 'bg', 'line'] as const;

export const TAB_BUTTON_COMPONENT_META: DocsComponentMeta = {
  name: 'TabButton',
  selector: 'lz-tab-button',
  description:
    'Одиночная вкладка-кнопка: варианты solid/bg (заливка) и line (подчёркивание). solid — алиас bg.',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Обзор',
    },
    {
      name: 'active',
      kind: 'boolean',
      default: true,
    },
    {
      name: 'size',
      kind: 'select',
      options: [...sizes],
      default: 'md',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...variants],
      default: 'bg',
      description: 'solid и bg эквивалентны',
    },
  ],
  variants: [
    { label: 'bg · active', props: { label: 'Обзор', active: true, size: 'md', variant: 'bg' } },
    { label: 'bg · idle', props: { label: 'Участники', active: false, size: 'md', variant: 'bg' } },
    {
      label: 'line · active',
      props: { label: 'Обзор', active: true, size: 'md', variant: 'line' },
    },
    {
      label: 'solid · active',
      props: { label: 'Обзор', active: true, size: 'md', variant: 'solid' },
    },
    { label: 'bg · sm', props: { label: 'Малый', active: true, size: 'sm', variant: 'bg' } },
    { label: 'line · lg', props: { label: 'Крупный', active: true, size: 'lg', variant: 'line' } },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: `'Tab'`,
      description: 'Текст кнопки',
    },
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      description: 'Активное состояние',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Размер',
    },
    {
      name: 'variant',
      type: `'solid' | 'bg' | 'line'`,
      default: `'bg'`,
      description: 'solid → bg; line — underline-индикатор',
    },
    {
      name: 'link',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Если задан — рендерит routerLink вместо button',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Группа вкладок',
      code: `<nav class="tabs">
  <lz-tab-button label="Обзор" [active]="true" variant="bg" />
  <lz-tab-button label="Участники" variant="bg" />
  <lz-tab-button label="Настройки" variant="bg" />
</nav>`,
    },
    {
      title: 'С routerLink',
      code: `<lz-tab-button label="Профиль" link="/profile" [active]="true" variant="line" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-gray-*', description: 'Текст и фон активного bg/solid' },
    { name: '--lz-duration-normal', description: 'Transition hover / active' },
    { name: '--lz-radius-md', description: 'Скругление control' },
  ],
};
