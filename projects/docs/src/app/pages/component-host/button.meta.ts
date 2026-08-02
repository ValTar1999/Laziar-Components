import { DocsComponentMeta } from '../../core/component-doc.model';
import { LZ_BUTTON_COLORS, LZ_BUTTON_SIZES, LZ_BUTTON_VARIANTS } from '@laziar/components';

const variantSizeGallery = LZ_BUTTON_VARIANTS.flatMap((variant) =>
  LZ_BUTTON_SIZES.map((size) => ({
    label: `${variant} · ${size}`,
    props: {
      variant,
      size,
      color: 'red',
      // как в publikator: iconOnly = icon без label; остальные — только текст
      label: variant === 'iconOnly' ? '' : variant,
      icon: variant === 'iconOnly' ? 'plus' : '',
      disabled: false,
      pill: false,
      fullWidth: false,
      iconPosition: 'right',
      type: 'button',
    },
  })),
);

export const BUTTON_COMPONENT_META: DocsComponentMeta = {
  name: 'Button',
  selector: 'lz-button',
  description:
    'Эталонный компонент библиотеки. Объединённый API publikator + agora-frontend: варианты, размеры, палитра, a11y и явный buttonClick.',
  contentFrom: 'label',
  controls: [
    {
      name: 'label',
      kind: 'string',
      default: 'Сохранить',
    },
    {
      name: 'variant',
      kind: 'select',
      options: [...LZ_BUTTON_VARIANTS],
      default: 'primary',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...LZ_BUTTON_SIZES],
      default: 'md',
    },
    {
      name: 'color',
      kind: 'select',
      options: [...LZ_BUTTON_COLORS],
      default: 'red',
    },
    {
      name: 'type',
      kind: 'select',
      options: ['button', 'submit', 'reset'],
      default: 'button',
    },
    {
      name: 'icon',
      kind: 'string',
      default: 'check',
      description:
        'Имя символа из /assets/icons/icons-{outline|solid|…}.svg (например check, x-mark, plus)',
    },
    {
      name: 'iconVariant',
      kind: 'select',
      options: ['outline', 'solid', 'mini', 'micro'],
      default: 'outline',
      description: 'Спрайт lz-icon: outline / solid / mini / micro',
    },
    {
      name: 'iconPosition',
      kind: 'select',
      options: ['left', 'right'],
      default: 'right',
    },
    {
      name: 'disabled',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'pill',
      kind: 'boolean',
      default: false,
    },
    {
      name: 'fullWidth',
      kind: 'boolean',
      default: false,
    },
  ],
  variants: variantSizeGallery,
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: "''",
      description: 'Текст кнопки (альтернатива — default ng-content)',
    },
    {
      name: 'variant',
      type: `'primary' | 'outline' | 'secondary' | 'tertiary' | 'link' | 'iconOnly'`,
      default: `'primary'`,
      description: 'Визуальный вариант',
    },
    {
      name: 'size',
      type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
      default: `'md'`,
      description: 'Размер (паддинги publikator)',
    },
    {
      name: 'type',
      type: `'button' | 'submit' | 'reset'`,
      default: `'button'`,
      description: 'Нативный type у <button>',
    },
    {
      name: 'icon',
      type: 'string',
      default: 'undefined',
      description: 'Имя иконки; кастом — слот [lzButtonIcon]',
    },
    {
      name: 'iconVariant',
      type: `'outline' | 'solid' | 'mini' | 'micro'`,
      default: 'undefined',
      description: 'Вариант спрайта для lz-icon (type)',
    },
    {
      name: 'iconPosition',
      type: `'left' | 'right'`,
      default: `'right'`,
      description: 'Позиция иконки относительно текста',
    },
    {
      name: 'iconClass',
      type: 'string',
      default: 'undefined',
      description: 'Доп. класс на обёртке иконки',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Отключает кнопку и блокирует buttonClick',
    },
    {
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Полностью скруглённая (rounded-full)',
    },
    {
      name: 'color',
      type: `'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple'`,
      default: `'gray'`,
      description: 'Палитра → семантические токены',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Растянуть на 100% ширины хоста',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: 'undefined',
      description: 'aria-label (обязателен для icon-only, иначе fallback)',
    },
    {
      name: 'ariaCurrentPage',
      type: 'boolean',
      default: 'false',
      description: 'Ставит aria-current="page" (пагинация)',
    },
  ],
  outputs: [
    {
      name: 'buttonClick',
      type: 'OutputEmitterRef<void>',
      description: 'Клик / активация, только если не disabled',
    },
  ],
  slots: [
    {
      name: '(default)',
      description: 'Доп. содержимое рядом с label',
    },
    {
      name: '[lzButtonIcon]',
      description: 'Кастомная иконка вместо lz-icon по имени',
    },
  ],
  deprecated: [
    {
      name: 'rounded',
      type: 'boolean',
      replacedBy: 'pill',
      description: 'Старое имя из publikator/agora',
    },
    {
      name: 'iconDirection',
      type: `'left' | 'right'`,
      replacedBy: 'iconPosition',
      description: 'Старое имя позиции иконки',
    },
  ],
  examples: [
    {
      title: 'В форме',
      description: 'Submit primary + secondary cancel.',
      code: `<form (ngSubmit)="save()">
  <lz-button variant="secondary" color="gray" label="Отмена" />
  <lz-button type="submit" variant="primary" color="red" label="Сохранить" icon="check" />
</form>`,
    },
    {
      title: 'В модалке',
      description: 'Футер диалога.',
      code: `<footer class="dialog-actions">
  <lz-button variant="tertiary" color="gray" label="Отмена" (buttonClick)="close()" />
  <lz-button variant="primary" color="red" label="Удалить" (buttonClick)="confirm()" />
</footer>`,
    },
    {
      title: 'Icon-only с a11y',
      code: `<lz-button
  variant="iconOnly"
  icon="x-mark"
  ariaLabel="Закрыть"
  (buttonClick)="close()"
/>`,
    },
    {
      title: 'Deprecated-алиас (миграции)',
      description: 'rounded → pill; не используйте в новом коде.',
      code: `<!-- предпочтительно -->
<lz-button pill label="Pill" />
<!-- @deprecated -->
<lz-button [rounded]="true" label="Pill" />`,
    },
  ],
  tokens: [
    { name: '--lz-button-fg', description: 'Цвет текста / иконки' },
    { name: '--lz-button-bg', description: 'Фон' },
    { name: '--lz-button-bg-hover', description: 'Фон при hover' },
    { name: '--lz-button-border', description: 'Цвет рамки' },
    { name: '--lz-button-ring', description: 'Кольцо focus-visible' },
    { name: '--lz-button-radius', description: 'Скругление (перебивается pill)' },
    { name: '--lz-button-icon-size', description: 'Размер иконки по size' },
    { name: '--lz-button-tone-*', description: 'Локальная шкала тона от color' },
    { name: '--lz-color-primary / secondary / …', description: 'Семантические палитры' },
    { name: '--lz-color-purple-*', description: 'Палитра purple для color="purple"' },
    { name: '--lz-duration-normal', description: 'Длительность transition' },
    { name: '--lz-radius-full', description: 'Pill-форма' },
  ],
};
