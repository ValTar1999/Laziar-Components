import { DocsComponentMeta } from '../../core/component-doc.model';

export const PULSE_DOT_COMPONENT_META: DocsComponentMeta = {
  name: 'PulseDot',
  selector: 'lz-pulse-dot',
  description: 'Pulsing status dot (live / online). No inputs.',
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
      title: 'Next to the title',
      code: `<h3>
  Live stream
  <lz-pulse-dot />
</h3>`,
    },
    {
      title: 'In a list',
      code: `<span class="status">
  <lz-pulse-dot />
  Online
</span>`,
    },
  ],
  tokens: [
    { name: 'core #d50b0b', description: 'Center dot color' },
    { name: 'ring #ec3131', description: 'Pulsing ring color' },
  ],
};
