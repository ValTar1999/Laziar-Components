import { DocsComponentMeta } from '../../core/component-doc.model';

const notificationStatuses = ['success', 'error', 'warning', 'info'] as const;
const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export const AVATAR_COMPONENT_META: DocsComponentMeta = {
  name: 'Avatar',
  selector: 'lz-avatar',
  description:
    'Аватар пользователя: инициалы, изображение, размеры и статусные индикаторы (онлайн / уведомление).',
  controls: [
    {
      name: 'firstName',
      kind: 'string',
      default: 'Анна',
    },
    {
      name: 'lastName',
      kind: 'string',
      default: 'Иванова',
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
      options: ['default', 'plain'],
      default: 'default',
    },
    {
      name: 'topNotification',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'bottomNotification',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'topNotificationStatus',
      kind: 'select',
      options: [...notificationStatuses],
      default: 'error',
    },
    {
      name: 'bottomNotificationStatus',
      kind: 'select',
      options: [...notificationStatuses],
      default: 'info',
    },
    {
      name: 'imgUrl',
      kind: 'string',
      default: '',
      description: 'URL изображения; пустая строка — инициалы / плейсхолдер',
    },
  ],
  variants: [
    {
      label: 'default · md',
      props: { firstName: 'Анна', lastName: 'Иванова', size: 'md', variant: 'default' },
    },
    {
      label: 'plain · lg',
      props: { firstName: 'Борис', lastName: 'Петров', size: 'lg', variant: 'plain' },
    },
    {
      label: 'sm · top status',
      props: {
        firstName: 'Вера',
        lastName: 'Сидорова',
        size: 'sm',
        variant: 'default',
        topNotification: true,
        topNotificationStatus: 'success',
      },
    },
    {
      label: 'xl · bottom status',
      props: {
        firstName: 'Глеб',
        lastName: 'Козлов',
        size: 'xl',
        variant: 'default',
        bottomNotification: true,
        bottomNotificationStatus: 'warning',
      },
    },
    {
      label: 'xxs · initials',
      props: { firstName: 'Дарья', lastName: 'Новикова', size: 'xxs', variant: 'default' },
    },
    {
      label: '2xl · both',
      props: {
        firstName: 'Егор',
        lastName: 'Смирнов',
        size: '2xl',
        variant: 'default',
        topNotification: true,
        topNotificationStatus: 'error',
        bottomNotification: true,
        bottomNotificationStatus: 'info',
      },
    },
  ],
  inputs: [
    {
      name: 'firstName',
      type: 'string',
      default: "''",
      description: 'Имя (для инициалов и alt)',
    },
    {
      name: 'lastName',
      type: 'string',
      default: "''",
      description: 'Фамилия (для инициалов и alt)',
    },
    {
      name: 'imgUrl',
      type: 'string | SafeUrl | undefined',
      default: 'undefined',
      description: 'URL фото; без него — инициалы или плейсхолдер',
    },
    {
      name: 'size',
      type: `'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`,
      default: `'sm'`,
      description: 'Размер аватара',
    },
    {
      name: 'variant',
      type: `'default' | 'plain'`,
      default: `'default'`,
      description: 'default — рамка/фон плейсхолдера; plain — без них',
    },
    {
      name: 'topNotification',
      type: 'boolean',
      default: 'false',
      description: 'Показать индикатор сверху справа',
    },
    {
      name: 'bottomNotification',
      type: 'boolean',
      default: 'false',
      description: 'Показать индикатор снизу справа',
    },
    {
      name: 'topNotificationStatus',
      type: `'success' | 'error' | 'warning' | 'info'`,
      default: `'error'`,
      description: 'Цвет верхнего индикатора',
    },
    {
      name: 'bottomNotificationStatus',
      type: `'success' | 'error' | 'warning' | 'info'`,
      default: `'info'`,
      description: 'Цвет нижнего индикатора',
    },
    {
      name: 'imgNotification',
      type: 'string',
      default: "''",
      description: 'Доп. изображение-бейдж поверх аватара',
    },
    {
      name: 'containerClass',
      type: 'string',
      default: "''",
      description: 'Доп. класс на контейнере аватара',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Инициалы',
      code: `<lz-avatar firstName="Анна" lastName="Иванова" size="md" />`,
    },
    {
      title: 'С фото и статусом',
      code: `<lz-avatar
  firstName="Анна"
  lastName="Иванова"
  imgUrl="/assets/demo/avatar.jpg"
  size="lg"
  [topNotification]="true"
  topNotificationStatus="success"
/>`,
    },
    {
      title: 'Plain без рамки',
      code: `<lz-avatar firstName="Борис" lastName="Петров" variant="plain" size="sm" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-gray-*', description: 'Фон / текст инициалов и плейсхолдера' },
    { name: '--lz-color-success', description: 'Индикатор success' },
    { name: '--lz-color-danger', description: 'Индикатор error' },
    { name: '--lz-color-warning', description: 'Индикатор warning' },
    { name: '--lz-radius-full', description: 'Круглая форма аватара' },
  ],
};
