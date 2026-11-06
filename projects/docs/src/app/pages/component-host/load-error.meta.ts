import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOAD_ERROR_COMPONENT_META: DocsComponentMeta = {
  name: 'Load Error',
  selector: 'lz-load-error',
  description:
    'Data that failed to load: an error alert with a retry button on its right. The host is role="alert", so screen readers announce it when it appears.',
  controls: [
    { name: 'heading', kind: 'string', default: 'Eroare la încărcarea știrilor' },
    { name: 'text', kind: 'string', default: 'Verificați conexiunea și încercați din nou.' },
    { name: 'retryLabel', kind: 'string', default: 'Reîncearcă' },
  ],
  variants: [
    {
      label: 'with retry',
      props: { heading: 'Eroare la încărcarea știrilor', text: '', retryLabel: 'Reîncearcă' },
    },
    {
      label: 'no retry',
      props: {
        heading: 'Nu s-au putut încărca datele',
        text: 'Încercați mai târziu.',
        retryLabel: '',
      },
    },
  ],
  inputs: [
    { name: 'heading', type: 'string', default: `''`, description: 'Alert title' },
    { name: 'text', type: 'string', default: `''`, description: 'Text under the title' },
    {
      name: 'retryLabel',
      type: 'string',
      default: `'Reîncearcă'`,
      description: 'Retry button label; no button without it',
    },
  ],
  outputs: [{ name: 'retry', type: 'OutputEmitterRef<void>', description: 'Retry button click' }],
  slots: [],
  examples: [
    {
      title: 'Instead of a list that failed',
      code: `@if (error()) {
  <lz-load-error heading="Eroare la încărcarea știrilor" (retry)="reload()" />
}`,
    },
  ],
  tokens: [],
};
