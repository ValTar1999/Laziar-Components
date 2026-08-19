import { DocsComponentMeta } from '../../core/component-doc.model';

export const SWIPER_COMPONENT_META: DocsComponentMeta = {
  name: 'SwiperComponent',
  selector: 'lz-swiper',
  description:
    'Carousel with prev/next controls. Project slides as swiper-slide children (CUSTOM_ELEMENTS_SCHEMA).',
  controls: [],
  variants: [{ label: 'default', props: {} }],
  inputs: [],
  outputs: [],
  slots: [{ name: 'default', description: 'swiper-slide elements' }],
  examples: [
    {
      title: 'Three slides',
      code: `<lz-swiper>
  <swiper-slide>Slide 1</swiper-slide>
  <swiper-slide>Slide 2</swiper-slide>
  <swiper-slide>Slide 3</swiper-slide>
</lz-swiper>`,
    },
  ],
  tokens: [{ name: '--lz-color-neutral-50', description: 'Slide surface in this demo' }],
};
