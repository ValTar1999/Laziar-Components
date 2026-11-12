import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOAD_ERROR_COMPONENT_META: DocsComponentMeta = {
  name: 'LoadError',
  selector: 'lz-load-error',
  description: 'Data that failed to load: an error alert with a retry button on its right.',
  controls: [
    { name: 'heading', kind: 'string', default: 'Could not load the campaigns' },
    { name: 'text', kind: 'string', default: 'Check the connection and try again.' },
    { name: 'retryLabel', kind: 'string', default: 'Try again' },
  ],
  variants: [
    {
      label: 'with retry',
      props: {
        heading: 'Could not load the campaigns',
        text: 'Check the connection and try again.',
        retryLabel: 'Try again',
      },
    },
    { label: 'no retry', props: { heading: 'Could not load the campaigns', retryLabel: '' } },
  ],
  inputs: [
    { name: 'heading', type: 'string', default: `''`, description: 'Alert title' },
    { name: 'text', type: 'string', default: `''`, description: 'Alert text' },
    {
      name: 'retryLabel',
      type: 'string',
      default: `'Reîncearcă'`,
      description: 'Retry button label, pass a localized string; there is no button without it',
    },
  ],
  outputs: [
    { name: 'retry', type: 'OutputEmitterRef<void>', description: 'The retry button was clicked' },
  ],
  slots: [],
  examples: [
    {
      title: 'Failed list',
      code: `@if (failed()) {
  <lz-load-error
    heading="Could not load the campaigns"
    text="Check the connection and try again."
    retryLabel="Try again"
    (retry)="reload()"
  />
}`,
    },
  ],
  tokens: [{ name: '--lz-color-danger-surface', description: 'Alert background' }],
};
