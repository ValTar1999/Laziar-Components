import { DocsComponentMeta } from '../../core/component-doc.model';

const sizes = ['xxs', 'xs', 'sm', 'md', 'lg'] as const;

export const AVATAR_GROUP_COMPONENT_META: DocsComponentMeta = {
  name: 'AvatarGroup',
  selector: 'lz-avatar-group',
  description:
    'Avatar group with a visible-item limit and remaining count. Suitable for participant lists.',
  controls: [
    {
      name: 'max',
      kind: 'number',
      default: 3,
      description: 'How many avatars to show before “+N”',
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
      description: 'Reverse stacking order (z-index)',
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
      description: 'Participant list: firstName, lastName, optional imgUrl',
    },
    {
      name: 'max',
      type: 'number',
      default: '4',
      description: 'Maximum visible avatars; the rest go into “+N”',
    },
    {
      name: 'size',
      type: `'xxs' | 'xs' | 'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Group item size',
    },
    {
      name: 'reverse',
      type: 'boolean',
      default: 'false',
      description: 'Inverts stacking z-index',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Chat members',
      code: `<lz-avatar-group
  [avatars]="[
    { firstName: 'Anna', lastName: 'Ivanova' },
    { firstName: 'Boris', lastName: 'Petrov' },
    { firstName: 'Vera', lastName: 'Sidorova' },
    { firstName: 'Gleb', lastName: 'Kozlov' }
  ]"
  [max]="3"
  size="md"
/>`,
    },
    {
      title: 'Reverse stacking',
      code: `<lz-avatar-group [avatars]="members" [max]="4" size="sm" [reverse]="true" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-50', description: 'Initials and “+N” remainder background' },
    { name: '--lz-color-neutral-700', description: 'Initials and “+N” text' },
    { name: '--lz-color-neutral-900', description: 'Fallback 10% outline (#121212)' },
    { name: '--lz-color-background', description: 'Cream ring between overlapping avatars (#FFFFFA)' },
  ],
};
