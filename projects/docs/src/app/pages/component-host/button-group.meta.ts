import { DocsComponentMeta } from '../../core/component-doc.model';

export const BUTTON_GROUP_COMPONENT_META: DocsComponentMeta = {
  name: 'ButtonGroup',
  selector: 'lz-button-group',
  description:
    'Обёртка для сегментированной группы кнопок: общая рамка, скругление краёв и опциональные разделители (line).',
  controls: [
    {
      name: 'line',
      kind: 'boolean',
      default: false,
      description: 'Разделители между кнопками',
    },
  ],
  variants: [
    {
      label: 'без разделителей',
      props: { line: false },
      code: `<lz-button-group>
  <lz-button label="Слева" variant="secondary" color="gray" />
  <lz-button label="Центр" variant="secondary" color="gray" />
  <lz-button label="Справа" variant="secondary" color="gray" />
</lz-button-group>`,
    },
    {
      label: 'с line',
      props: { line: true },
      code: `<lz-button-group [line]="true">
  <lz-button label="Слева" variant="secondary" color="gray" />
  <lz-button label="Центр" variant="secondary" color="gray" />
  <lz-button label="Справа" variant="secondary" color="gray" />
</lz-button-group>`,
    },
  ],
  inputs: [
    {
      name: 'line',
      type: 'boolean',
      default: 'false',
      description: 'Показать разделители между дочерними кнопками',
    },
    {
      name: 'divided',
      type: 'boolean',
      default: 'false',
      description: '@deprecated — алиас line',
    },
  ],
  outputs: [],
  slots: [
    {
      name: '(default)',
      description: 'Дочерние lz-button (или нативные button)',
    },
  ],
  deprecated: [
    {
      name: 'divided',
      type: 'boolean',
      replacedBy: 'line',
      description: 'Старое имя разделителей',
    },
  ],
  examples: [
    {
      title: 'Сегментированный переключатель',
      code: `<lz-button-group [line]="true">
  <lz-button label="День" variant="secondary" color="gray" />
  <lz-button label="Неделя" variant="secondary" color="gray" />
  <lz-button label="Месяц" variant="secondary" color="gray" />
</lz-button-group>`,
    },
    {
      title: 'Без разделителей',
      code: `<lz-button-group>
  <lz-button label="Слева" variant="secondary" color="gray" />
  <lz-button label="Центр" variant="secondary" color="gray" />
  <lz-button label="Справа" variant="secondary" color="gray" />
</lz-button-group>`,
    },
  ],
  tokens: [
    { name: '--lz-color-gray-*', description: 'Рамка группы и разделители' },
    { name: '--lz-radius-md', description: 'Скругление контейнера (0.5rem)' },
  ],
};
