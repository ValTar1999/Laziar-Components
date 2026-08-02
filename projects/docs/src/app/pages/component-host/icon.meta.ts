import { DocsComponentMeta } from '../../core/component-doc.model';

const iconTypes = ['outline', 'solid', 'mini', 'micro', 'custom'] as const;

export const ICON_COMPONENT_META: DocsComponentMeta = {
  name: 'Icon',
  selector: 'lz-icon',
  description:
    'SVG-иконка из спрайтов Heroicons / кастомных: outline, solid, mini, micro, custom. Имя — id символа в спрайте.',
  controls: [
    {
      name: 'name',
      kind: 'string',
      default: 'check',
      description: 'Имя символа (например check, x-mark, plus)',
    },
    {
      name: 'type',
      kind: 'select',
      options: [...iconTypes],
      default: 'outline',
      description: 'Спрайт: icons-{type}.svg',
    },
  ],
  variants: [
    { label: 'outline · check', props: { name: 'check', type: 'outline' } },
    { label: 'solid · check', props: { name: 'check', type: 'solid' } },
    { label: 'mini · plus', props: { name: 'plus', type: 'mini' } },
    { label: 'micro · x-mark', props: { name: 'x-mark', type: 'micro' } },
    { label: 'outline · heart', props: { name: 'heart', type: 'outline' } },
    { label: 'solid · star', props: { name: 'star', type: 'solid' } },
  ],
  inputs: [
    {
      name: 'name',
      type: 'string',
      default: '— (required)',
      description: 'Id символа в SVG-спрайте',
    },
    {
      name: 'type',
      type: `'outline' | 'solid' | 'mini' | 'micro' | 'custom'`,
      default: `'outline'`,
      description: 'Вариант спрайта',
    },
    {
      name: 'iconClass',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Доп. классы на SVG; w-* отключает дефолтный размер',
    },
    {
      name: 'assetsPath',
      type: 'string',
      default: `'assets/icons'`,
      description: 'Базовый путь к папке спрайтов',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'В кнопке',
      code: `<lz-icon name="check" type="outline" />`,
    },
    {
      title: 'Кастомный размер через iconClass',
      code: `<lz-icon name="plus" type="mini" iconClass="w-4 h-4" />`,
    },
    {
      title: 'Кастомный спрайт',
      description: 'Символ должен быть в icons-custom.svg.',
      code: `<lz-icon name="brand-mark" type="custom" />`,
    },
  ],
  tokens: [
    { name: '--lz-icon-size', description: 'Ширина/высота по умолчанию (1.5rem)' },
    { name: 'currentColor', description: 'Цвет иконки наследует от родителя' },
  ],
};
