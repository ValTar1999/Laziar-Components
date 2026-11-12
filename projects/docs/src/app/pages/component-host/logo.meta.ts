import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOGO_COMPONENT_META: DocsComponentMeta = {
  name: 'Logo',
  selector: 'lz-logo',
  description: 'The Laziar wordmark as a link to the home page.',
  controls: [
    { name: 'link', kind: 'string', default: '/' },
    { name: 'ariaLabel', kind: 'string', default: 'Laziar home' },
  ],
  variants: [{ label: 'default', props: { link: '/' } }],
  inputs: [
    { name: 'link', type: 'string', default: `'/'`, description: 'Router link the logo opens' },
    {
      name: 'ariaLabel',
      type: 'string',
      default: `'Laziar acasă'`,
      description: 'Accessible name of the link; pass a localized string',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'In a header',
      code: `<lz-logo link="/" ariaLabel="Laziar home" />`,
    },
  ],
  tokens: [{ name: '--lz-color-text-primary', description: 'Wordmark colour' }],
};
