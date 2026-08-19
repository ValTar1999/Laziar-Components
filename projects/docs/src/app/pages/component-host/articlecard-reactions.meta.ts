import { DocsComponentMeta } from '../../core/component-doc.model';

export const ARTICLECARD_REACTIONS_COMPONENT_META: DocsComponentMeta = {
  name: 'ArticlecardReactions',
  selector: 'lz-articlecard-reactions',
  description: 'Stacked reaction emojis with an optional +N badge when the total is 4 or more.',
  controls: [],
  variants: [{ label: 'default', props: {} }],
  inputs: [
    {
      name: 'articleMetrics',
      type: 'Record<string, unknown> | null',
      default: 'undefined',
      description: 'Map of emoji → count',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Article footer',
      code: `<lz-articlecard-reactions [articleMetrics]="{ '❤️': 12, '🔥': 4, '👏': 3 }" />`,
    },
  ],
  tokens: [{ name: '--lz-color-neutral-50', description: 'Badge background' }],
};
