import { DocsComponentMeta } from '../../core/component-doc.model';

export const PULSE_DOT_COMPONENT_META: DocsComponentMeta = {
  name: 'PulseDot',
  selector: 'lz-pulse-dot',
  description: 'Пульсирующая точка статуса (live / online). Без входных параметров.',
  controls: [],
  variants: [
    {
      label: 'default',
      props: {},
    },
  ],
  inputs: [],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Рядом с заголовком',
      code: `<h3>
  Прямой эфир
  <lz-pulse-dot />
</h3>`,
    },
    {
      title: 'В списке',
      code: `<span class="status">
  <lz-pulse-dot />
  Online
</span>`,
    },
  ],
  tokens: [
    { name: 'core #d50b0b', description: 'Цвет центральной точки' },
    { name: 'ring #ec3131', description: 'Цвет пульсирующего кольца' },
  ],
};
