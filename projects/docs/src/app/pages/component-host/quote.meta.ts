import { DocsComponentMeta, DocsSandboxValues } from '../../core/component-doc.model';

function quoteSnippet(values: DocsSandboxValues): string {
  const content = String(values['content'] ?? '');
  const fullName = String(values['authorName'] ?? '').trim();
  const position = String(values['authorPosition'] ?? '').trim();
  const avatarUrl = String(values['authorAvatar'] ?? '').trim();
  const subtext = String(values['subtext'] ?? '').trim();
  const lines = [`<lz-quote`, `  content="${content}"`];

  if (fullName || position || avatarUrl) {
    const author = [
      fullName ? `fullName: '${fullName}'` : '',
      position ? `position: '${position}'` : '',
      avatarUrl ? `avatarUrl: '${avatarUrl}'` : '',
    ]
      .filter(Boolean)
      .join(', ');
    lines.push(`  [author]="{ ${author} }"`);
  }

  if (subtext) {
    lines.push(`  subtext="${subtext}"`);
  }

  lines.push(`/>`);
  return lines.join('\n');
}

export const QUOTE_COMPONENT_META: DocsComponentMeta = {
  name: 'Quote',
  selector: 'lz-quote',
  description: 'Article pull-quote with an optional author line and caption.',
  controls: [
    {
      name: 'content',
      kind: 'string',
      default: 'To be or not to be, that is the question.',
    },
    { name: 'authorName', kind: 'string', default: 'Jane Doe' },
    { name: 'authorPosition', kind: 'string', default: 'Editor' },
    { name: 'authorAvatar', kind: 'string', default: '' },
    { name: 'subtext', kind: 'string', default: 'Annual report' },
  ],
  snippetIgnore: ['authorName', 'authorPosition', 'authorAvatar'],
  buildSnippet: quoteSnippet,
  variants: [
    {
      label: 'with author',
      props: {
        content: 'To be or not to be, that is the question.',
        authorName: 'Jane Doe',
        authorPosition: 'Editor',
        subtext: 'Annual report',
      },
    },
    {
      label: 'text only',
      props: {
        content: 'A short line, without a byline.',
        authorName: '',
        authorPosition: '',
        subtext: '',
      },
    },
  ],
  inputs: [
    {
      name: 'content',
      type: 'string',
      default: `''`,
      description: 'Quote body. CMS HTML, same as frontend blockContent',
    },
    {
      name: 'author',
      type: 'LzQuoteAuthor | null',
      default: 'null',
      description: 'fullName, position, avatarUrl',
    },
    {
      name: 'subtext',
      type: 'string',
      default: `''`,
      description: 'Caption under the author',
    },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Article block',
      code: `<lz-quote
  content="To be or not to be."
  [author]="{ fullName: 'Jane Doe', position: 'Editor' }"
  subtext="Annual report"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-font-serif', description: 'Quote body' },
    { name: '--lz-color-neutral-50', description: 'Panel background' },
    { name: '--lz-color-text-primary', description: 'Quote and author name' },
  ],
};
