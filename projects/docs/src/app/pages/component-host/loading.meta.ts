import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOADING_COMPONENT_META: DocsComponentMeta = {
  name: 'Loading',
  selector: 'lz-loading',
  description: 'Индикатор загрузки: круговой spinner или кольцо из точек.',
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
      description: 'Цвет индикатора',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl'`,
      default: `'xl'`,
      description: 'Размер',
    },
    {
      name: 'variant',
      type: `'spinner' | 'dot'`,
      default: `'spinner'`,
      description: 'Тип анимации',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'В блоке контента',
      code: `<div class="loading-wrap" aria-busy="true">
  <lz-loading color="red" size="md" variant="spinner" />
</div>`,
    },
    {
      title: 'Точки',
      code: `<lz-loading variant="dot" color="black" size="lg" />`,
    },
  ],
  tokens: [
    { name: '--lz-loading-size', description: 'Ширина / высота по size' },
    { name: '--lz-loading-tone', description: 'Цвет stroke / точек' },
  ],
};
