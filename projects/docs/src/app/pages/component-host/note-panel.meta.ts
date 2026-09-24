import { DocsComponentMeta } from '../../core/component-doc.model';

export const NOTE_PANEL_COMPONENT_META: DocsComponentMeta = {
  name: 'NotePanel',
  selector: 'lz-note-panel',
  description: 'Article note: bookmark icon and serif text in a bordered panel.',
  controls: [
    {
      name: 'content',
      kind: 'string',
      default:
        '<p>The quick brown fox jumps over the lazy dog. Now is the time for all good men to come to the aid of their country. If a woodchuck could chuck wood, how much wood could a woodchuck chuck?</p><p>The quick brown fox jumps over the lazy dog. Now is the time for all good men to come to the aid of their country. If a woodchuck could chuck wood, how much wood could a woodchuck chuck?</p>',
    },
  ],
  variants: [
    {
      label: 'default',
      props: {
        content:
          '<p>The quick brown fox jumps over the lazy dog. Now is the time for all good men to come to the aid of their country. If a woodchuck could chuck wood, how much wood could a woodchuck chuck?</p><p>The quick brown fox jumps over the lazy dog. Now is the time for all good men to come to the aid of their country. If a woodchuck could chuck wood, how much wood could a woodchuck chuck?</p>',
      },
    },
  ],
  inputs: [
    {
      name: 'content',
      type: 'string',
      default: `''`,
      description: 'Note body. CMS HTML, same as frontend blockContent',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Article block',
      code: `<lz-note-panel content="<p>Heads up: <em>read this</em> before you continue.</p>" />`,
    },
  ],
  tokens: [
    { name: '--lz-color-neutral-100', description: 'Panel border' },
    { name: '--lz-color-neutral-500', description: 'Bookmark icon' },
    { name: '--lz-font-serif', description: 'Note body' },
  ],
};
