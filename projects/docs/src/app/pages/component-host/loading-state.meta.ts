import { DocsComponentMeta } from '../../core/component-doc.model';

export const LOADING_STATE_COMPONENT_META: DocsComponentMeta = {
  name: 'Loading State',
  selector: 'lz-loading-state',
  description:
    'A page or section that is still loading: a small spinner and a muted label, centred, 40px from what is above. Screen readers hear the label, or srLabel when there is none.',
  controls: [
    { name: 'label', kind: 'string', default: 'Se încarcă short-urile...' },
    {
      name: 'srLabel',
      kind: 'string',
      default: 'Se încarcă...',
      description: 'Announced when there is no label',
    },
  ],
  variants: [
    { label: 'with label', props: { label: 'Se încarcă short-urile...' } },
    { label: 'spinner only', props: { label: '' } },
  ],
  inputs: [
    {
      name: 'label',
      type: 'string',
      default: `''`,
      description: 'Visible text next to the spinner',
    },
    {
      name: 'srLabel',
      type: 'string',
      default: `'Se încarcă...'`,
      description: 'Announced to screen readers instead of the label when there is no visible one',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'While a list loads',
      code: `@if (loading()) {
  <lz-loading-state label="Se încarcă short-urile..." />
}`,
    },
  ],
  tokens: [],
};
