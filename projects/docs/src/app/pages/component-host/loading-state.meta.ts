import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOADING_STATE_COMPONENT_META: DocsComponentMeta = {
  name: 'LoadingState',
  selector: 'lz-loading-state',
  description:
    'A page or section that is still loading: a small spinner and a muted label, centred. The label is announced to screen readers.',
  controls: [{ name: 'label', kind: 'string', default: 'Loading campaigns...' }],
  variants: [
    { label: 'with label', props: { label: 'Loading campaigns...' } },
    { label: 'spinner only', props: { label: '' } },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: `''`,
      description: 'Text beside the spinner, e.g. "Loading campaigns..."',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'While a list loads',
      code: `@if (loading()) {
  <lz-loading-state label="Loading campaigns..." />
}`,
    },
  ],
  tokens: [{ name: '--lz-color-text-secondary', description: 'Label' }],
};
