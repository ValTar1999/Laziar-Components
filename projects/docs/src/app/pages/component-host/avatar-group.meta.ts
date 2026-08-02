import { DocsComponentMeta } from '../../core/component-doc.model';

const sizes = ['xxs', 'xs', 'sm', 'md', 'lg'] as const;

export const AVATAR_GROUP_COMPONENT_META: DocsComponentMeta = {
  name: 'AvatarGroup',
  selector: 'lz-avatar-group',
  description:
    'Группа аватаров с ограничением видимых элементов и счётчиком оставшихся. Подходит для списков участников.',
  controls: [
    {
      name: 'max',
      kind: 'number',
      default: 3,
      description: 'Сколько аватаров показать до «+N»',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...sizes],
      default: 'md',
    },
    {
      name: 'reverse',
      kind: 'boolean',
      default: false,
      description: 'Обратный порядок наложения (z-index)',
    },
  ],
  variants: [
    {
      label: 'max 3 · md',
      props: { max: 3, size: 'md', reverse: false },
    },
    {
      label: 'max 2 · sm',
      props: { max: 2, size: 'sm', reverse: false },
    },
    {
      label: 'max 4 · lg',
      props: { max: 4, size: 'lg', reverse: false },
    },
    {
      label: 'max 3 · reverse',
      props: { max: 3, size: 'md', reverse: true },
    },
    {
      label: 'max 5 · xxs',
      props: { max: 5, size: 'xxs', reverse: false },
    },
    {
      label: 'max 1 · xs',
      props: { max: 1, size: 'xs', reverse: false },
    },
  ],
  inputs: [
    {
      name: 'avatars',
      type: 'LzAvatarGroupItem[]',
      default: '[]',
      description: 'Список участников: firstName, lastName, опционально imgUrl',
    },
    {
      name: 'max',
      type: 'number',
      default: '4',
      description: 'Максимум видимых аватаров; остальные — в «+N»',
    },
    {
      name: 'size',
      type: `'xxs' | 'xs' | 'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Размер элементов группы',
    },
    {
      name: 'reverse',
      type: 'boolean',
      default: 'false',
      description: 'Инвертирует z-index наложения',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Участники чата',
      code: `<lz-avatar-group
  [avatars]="[
    { firstName: 'Анна', lastName: 'Иванова' },
    { firstName: 'Борис', lastName: 'Петров' },
    { firstName: 'Вера', lastName: 'Сидорова' },
    { firstName: 'Глеб', lastName: 'Козлов' }
  ]"
  [max]="3"
  size="md"
/>`,
    },
    {
      title: 'Обратное наложение',
      code: `<lz-avatar-group [avatars]="members" [max]="4" size="sm" [reverse]="true" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-gray-*', description: 'Фон fallback-инициалов и остатка «+N»' },
    { name: '--lz-radius-full', description: 'Круглая форма элементов' },
  ],
};
