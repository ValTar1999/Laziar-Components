import { DocsComponentMeta } from '../../core/component-doc.model';

const notificationStatuses = ['success', 'error', 'warning', 'info'] as const;
const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export const AVATAR_COMPONENT_META: DocsComponentMeta = {
  name: 'Avatar',
  selector: 'lz-avatar',
  description:
    'User avatar: initials, image, sizes, and status indicators (online / notification).',
  controls: [
    {
      name: 'firstName',
      kind: 'string',
      default: 'Anna',
    },
    {
      name: 'lastName',
      kind: 'string',
      default: 'Ivanova',
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
      description: 'Image URL; empty string — initials / placeholder',
    },
  ],
  variants: [
    {
      label: 'default · md',
      props: { firstName: 'Anna', lastName: 'Ivanova', size: 'md', variant: 'default' },
    },
    {
      label: 'plain · lg',
      props: { firstName: 'Boris', lastName: 'Petrov', size: 'lg', variant: 'plain' },
    },
    {
      label: 'sm · top status',
      props: {
        firstName: 'Vera',
        lastName: 'Sidorova',
        size: 'sm',
        variant: 'default',
        topNotification: true,
        topNotificationStatus: 'success',
      },
    },
    {
      label: 'xl · bottom status',
      props: {
        firstName: 'Gleb',
        lastName: 'Kozlov',
        size: 'xl',
        variant: 'default',
        bottomNotification: true,
        bottomNotificationStatus: 'warning',
      },
    },
    {
      label: 'xxs · initials',
      props: { firstName: 'Daria', lastName: 'Novikova', size: 'xxs', variant: 'default' },
    },
    {
      label: '2xl · both',
      props: {
        firstName: 'Egor',
        lastName: 'Smirnov',
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
      description: 'First name (for initials and alt)',
    },
    {
      name: 'lastName',
      type: 'string',
      default: "''",
      description: 'Last name (for initials and alt)',
    },
    {
      name: 'imgUrl',
      type: 'string | SafeUrl | undefined',
      default: 'undefined',
      description: 'Photo URL; without it — initials or placeholder',
    },
    {
      name: 'size',
      type: `'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`,
      default: `'sm'`,
      description: 'Avatar size',
    },
    {
      name: 'variant',
      type: `'default' | 'plain'`,
      default: `'default'`,
      description: 'default — placeholder border/background; plain — without them',
    },
    {
      name: 'topNotification',
      type: 'boolean',
      default: 'false',
      description: 'Show indicator at the top right',
    },
    {
      name: 'bottomNotification',
      type: 'boolean',
      default: 'false',
      description: 'Show indicator at the bottom right',
    },
    {
      name: 'topNotificationStatus',
      type: `'success' | 'error' | 'warning' | 'info'`,
      default: `'error'`,
      description: 'Top indicator color',
    },
    {
      name: 'bottomNotificationStatus',
      type: `'success' | 'error' | 'warning' | 'info'`,
      default: `'info'`,
      description: 'Bottom indicator color',
    },
    {
      name: 'imgNotification',
      type: 'string',
      default: "''",
      description: 'Extra badge image over the avatar',
    },
    {
      name: 'containerClass',
      type: 'string',
      default: "''",
      description: 'Extra class on the avatar container',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Initials',
      code: `<lz-avatar firstName="Anna" lastName="Ivanova" size="md" />`,
    },
    {
      title: 'With photo and status',
      code: `<lz-avatar
  firstName="Anna"
  lastName="Ivanova"
  imgUrl="assets/demo/avatar.jpg"
  size="lg"
  [bottomNotification]="true"
  bottomNotificationStatus="success"
/>`,
    },
    {
      title: 'Plain without border',
      code: `<lz-avatar firstName="Boris" lastName="Petrov" variant="plain" size="sm" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-50', description: 'Initials and placeholder background' },
    { name: '--lz-color-neutral-700', description: 'Initials text' },
    { name: '--lz-color-success-400', description: 'success indicator' },
    { name: '--lz-color-danger-400', description: 'error indicator' },
    { name: '--lz-color-warning-400', description: 'warning indicator' },
    { name: '--lz-color-neutral-400', description: 'info indicator (offline / grey)' },
    { name: '--lz-color-background', description: 'White ring around the status dot' },
  ],
};
