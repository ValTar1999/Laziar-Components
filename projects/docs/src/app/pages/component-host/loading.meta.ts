import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOADING_COMPONENT_META: DocsComponentMeta = {
  name: 'Loading',
  selector: 'lz-loading',
  description: 'Loading indicator: circular spinner or a ring of dots.',
  controls: [
    {
      name: 'color',
      kind: 'select',
      options: ['black', 'red'],
      default: 'black',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      default: 'xl',
    },
    {
      name: 'variant',
      kind: 'select',
      options: ['spinner', 'dot'],
      default: 'spinner',
    },
  ],
  variants: [
    {
      label: 'spinner · black · xl',
      props: { color: 'black', size: 'xl', variant: 'spinner' },
    },
    {
      label: 'spinner · red · md',
      props: { color: 'red', size: 'md', variant: 'spinner' },
    },
    {
      label: 'dot · black · lg',
      props: { color: 'black', size: 'lg', variant: 'dot' },
    },
    {
      label: 'dot · red · sm',
      props: { color: 'red', size: 'sm', variant: 'dot' },
    },
  ],
  inputs: [
    {
      name: 'color',
      type: `'black' | 'red'`,
      default: `'black'`,
      description: 'Indicator color',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl'`,
      default: `'xl'`,
      description: 'Size',
    },
    {
      name: 'variant',
      type: `'spinner' | 'dot'`,
      default: `'spinner'`,
      description: 'Animation type',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'In a content block',
      code: `<div class="loading-wrap" aria-busy="true">
  <lz-loading color="red" size="md" variant="spinner" />
</div>`,
    },
    {
      title: 'Dots',
      code: `<lz-loading variant="dot" color="black" size="lg" />`,
    },
  ],
  tokens: [
    { name: '--lz-loading-size', description: 'Width / height by size' },
    { name: '--lz-loading-tone', description: 'Stroke / dot color' },
  ],
};
