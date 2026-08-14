import { DocsComponentMeta } from '../../core/component-doc.model';

const PROGRESS_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export const PROGRESS_CIRCLE_COMPONENT_META: DocsComponentMeta = {
  name: 'ProgressCircle',
  selector: 'lz-progress-circle',
  description: 'Circular progress with percentage (label at larger sizes).',
  controls: [
    {
      name: 'progress',
      kind: 'number',
      default: 75,
      description: 'Percentage 0–100',
    },
    {
      name: 'size',
      kind: 'select',
      options: [...PROGRESS_SIZES],
      default: 'md',
    },
    {
      name: 'variant',
      kind: 'select',
      options: ['red', 'white'],
      default: 'red',
    },
  ],
  variants: PROGRESS_SIZES.map((size) => ({
    label: `${size} · 75%`,
    props: { progress: 75, size, variant: 'red' },
  })),
  inputs: [
    {
      name: 'progress',
      type: 'number',
      default: '75',
      description: 'Fill percentage (clamped 0–100)',
    },
    {
      name: 'size',
      type: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'`,
      default: `'md'`,
      description: 'Diameter; label on lg / xl / xxl',
    },
    {
      name: 'variant',
      type: `'red' | 'white'`,
      default: `'red'`,
      description: 'Arc color',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'File upload',
      code: `<lz-progress-circle [progress]="uploadPercent" size="lg" variant="red" />`,
    },
    {
      title: 'Compact',
      code: `<lz-progress-circle [progress]="40" size="xs" />`,
    },
  ],
  tokens: [
    { name: 'arc color (inline)', description: 'red → #ef4444, white → #121212' },
    { name: 'size map', description: 'xs–xxl → px and strokeWidth' },
  ],
};
