import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOGIN_PROMPT_BANNER_COMPONENT_META: DocsComponentMeta = {
  name: 'LoginPromptBanner',
  selector: 'lz-login-prompt-banner',
  description: 'Inline banner that sends the reader to an auth route.',
  controls: [
    { name: 'text', kind: 'string', default: 'Sign in to save articles' },
    { name: 'route', kind: 'string', default: '/auth' },
  ],
  variants: [
    {
      label: 'default',
      props: { text: 'Sign in to save articles', route: '/auth' },
    },
  ],
  inputs: [
    { name: 'text', type: 'string', default: `''`, description: 'Banner copy' },
    { name: 'route', type: 'string', default: `'/auth'`, description: 'RouterLink target' },
    {
      name: 'ariaLabel',
      type: 'string',
      default: `''`,
      description: 'Accessible name; falls back to text',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Article page',
      code: `<lz-login-prompt-banner text="Sign in to save articles" route="/auth" />`,
    },
  ],
  tokens: [{ name: '--lz-color-primary', description: 'Accent and icon' }],
};
