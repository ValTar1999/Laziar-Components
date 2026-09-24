import { DocsComponentMeta } from '../../core/component-doc.model';

export const EXPAND_COMPONENT_META: DocsComponentMeta = {
  name: 'Expand',
  selector: 'lz-expand',
  description: 'Article disclosure: a serif title with a chevron and a body that opens underneath.',
  controls: [
    { name: 'title', kind: 'string', default: 'Read more' },
    {
      name: 'content',
      kind: 'string',
      default: '<p>The full story continues here, in the same article type.</p>',
    },
  ],
  variants: [
    {
      label: 'open',
      props: {
        title: 'Read more',
        content: '<p>The full story continues here, in the same article type.</p>',
      },
    },
  ],
  inputs: [
    {
      name: 'title',
      type: 'string',
      default: `''`,
      description: 'Heading. CMS HTML, same as frontend expandTitle',
    },
    {
      name: 'content',
      type: 'string',
      default: `''`,
      description: 'Body. CMS HTML, same as frontend expandContent',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Article block',
      code: `<lz-expand title="Read more" content="<p>The full story.</p>" />`,
    },
  ],
  tokens: [
    { name: '--lz-font-serif', description: 'Title and body' },
    { name: '--lz-space-8', description: 'Line height, 32px' },
  ],
};
