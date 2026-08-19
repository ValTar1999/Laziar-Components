import {
  LZ_CARD_ROW_IMAGE_ASPECTS,
  LZ_CARD_ROW_IMAGE_HEIGHT_MODES,
  LZ_CARD_ROW_IDENTITY_POSITIONS,
  LZ_CARD_ROW_META_LAYOUTS,
  LZ_CARD_ROW_SUBTITLE_LAYOUTS,
  LZ_CARD_SIZES,
  LZ_CARD_VARIANTS,
} from '@laziar/components';
import { DocsComponentMeta } from '../../core/component-doc.model';

const SAMPLE_IMAGE = 'https://picsum.photos/id/1015/800/520';

const articleProps = {
  image: SAMPLE_IMAGE,
  title: 'Guvernul anunță un nou pachet de măsuri',
  subtitle:
    'Miniștrii au prezentat calendarul implementării și impactul asupra bugetului public pe următorii doi ani.',
  date: '19 aug., 14:46',
  publisher: 'AGORA',
  author: 'Redacția AGORA',
  publisherLogoUrl: '/assets/demo/publisher-agora.svg',
};

export const CARD_COMPONENT_META: DocsComponentMeta = {
  name: 'CardComponent',
  selector: 'lz-card',
  description:
    'Article card from frontend: col/row layouts, size scale, row image/identity/meta options, and more-actions.',
  controls: [
    { name: 'title', kind: 'string', default: articleProps.title },
    { name: 'subtitle', kind: 'string', default: articleProps.subtitle },
    { name: 'date', kind: 'string', default: articleProps.date },
    { name: 'publisher', kind: 'string', default: articleProps.publisher },
    { name: 'author', kind: 'string', default: articleProps.author },
    { name: 'publisherLogoUrl', kind: 'string', default: '/assets/demo/publisher-agora.svg' },
    { name: 'image', kind: 'string', default: SAMPLE_IMAGE },
    { name: 'variant', kind: 'select', options: [...LZ_CARD_VARIANTS], default: 'row' },
    { name: 'size', kind: 'select', options: [...LZ_CARD_SIZES], default: 'md' },
    {
      name: 'rowImageHeightMode',
      kind: 'select',
      options: [...LZ_CARD_ROW_IMAGE_HEIGHT_MODES],
      default: 'fixed',
    },
    {
      name: 'rowIdentityPosition',
      kind: 'select',
      options: [...LZ_CARD_ROW_IDENTITY_POSITIONS],
      default: 'top',
    },
    {
      name: 'rowMetaLayout',
      kind: 'select',
      options: [...LZ_CARD_ROW_META_LAYOUTS],
      default: 'inline',
    },
    {
      name: 'rowImageAspect',
      kind: 'select',
      options: [...LZ_CARD_ROW_IMAGE_ASPECTS],
      default: '1/1',
    },
    {
      name: 'rowImageAspectMd',
      kind: 'select',
      options: [...LZ_CARD_ROW_IMAGE_ASPECTS],
      default: '3/2',
    },
    {
      name: 'rowSubtitleLayout',
      kind: 'select',
      options: [...LZ_CARD_ROW_SUBTITLE_LAYOUTS],
      default: 'below',
    },
    { name: 'showBottomBorder', kind: 'boolean', default: true },
    { name: 'showActions', kind: 'boolean', default: true },
    { name: 'metricsType', kind: 'boolean', default: false },
    { name: 'isLoading', kind: 'boolean', default: false },
  ],
  variants: [
    {
      label: 'row · xl · listing',
      props: {
        ...articleProps,
        variant: 'row',
        size: 'md',
        rowIdentityPosition: 'top',
        rowMetaLayout: 'inline',
        rowImageAspect: '1/1',
        rowImageAspectMd: '3/2',
        rowImageHeightMode: 'fixed',
      },
    },
    { label: 'col · xl', props: { ...articleProps, variant: 'col', size: 'xl' } },
    { label: 'col · lg', props: { ...articleProps, variant: 'col', size: 'lg' } },
    { label: 'col · md', props: { ...articleProps, variant: 'col', size: 'md' } },
    { label: 'col · sm', props: { ...articleProps, variant: 'col', size: 'sm' } },
    { label: 'col · xs', props: { ...articleProps, variant: 'col', size: 'xs' } },
    { label: 'col · xxs', props: { ...articleProps, variant: 'col', size: 'xxs' } },
    {
      label: 'row · xl · identity top · split · 1/1',
      props: {
        ...articleProps,
        variant: 'row',
        size: 'xl',
        rowIdentityPosition: 'top',
        rowMetaLayout: 'split',
        rowImageAspect: '1/1',
        rowImageHeightMode: 'fixed',
      },
    },
    {
      label: 'row · xl · identity bottom',
      props: {
        ...articleProps,
        variant: 'row',
        size: 'xl',
        rowIdentityPosition: 'bottom',
        rowMetaLayout: 'split',
      },
    },
    {
      label: 'row · xl · meta inline',
      props: {
        ...articleProps,
        variant: 'row',
        size: 'xl',
        rowMetaLayout: 'inline',
        rowImageAspect: '1/1',
      },
    },
    {
      label: 'row · xl · aspect 3/2',
      props: {
        ...articleProps,
        variant: 'row',
        size: 'xl',
        rowImageAspect: '3/2',
      },
    },
    {
      label: 'row · xl · aspect default · height full',
      props: {
        ...articleProps,
        variant: 'row',
        size: 'xl',
        rowImageAspect: 'default',
        rowImageHeightMode: 'full',
      },
    },
    { label: 'row · lg', props: { ...articleProps, variant: 'row', size: 'lg' } },
    { label: 'row · md', props: { ...articleProps, variant: 'row', size: 'md' } },
    { label: 'row · sm', props: { ...articleProps, variant: 'row', size: 'sm' } },
    { label: 'grid · xl', props: { ...articleProps, variant: 'grid', size: 'xl' } },
    { label: 'grid · lg', props: { ...articleProps, variant: 'grid', size: 'lg' } },
    {
      label: 'reactions',
      props: { ...articleProps, variant: 'col', size: 'md', metricsType: true },
    },
    { label: 'loading', props: { ...articleProps, isLoading: true } },
    {
      label: 'no border',
      props: { ...articleProps, variant: 'col', size: 'md', showBottomBorder: false },
    },
  ],
  inputs: [
    { name: 'publisher', type: 'string', default: `''`, description: 'Publisher name' },
    { name: 'author', type: 'string', default: `''`, description: 'Author name' },
    {
      name: 'publisherLogoUrl',
      type: 'string',
      default: `''`,
      description: 'Publisher avatar URL',
    },
    {
      name: 'image',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Cover image URL',
    },
    { name: 'title', type: 'string | undefined', default: 'undefined', description: 'Headline' },
    {
      name: 'subtitle',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Standfirst',
    },
    { name: 'date', type: 'string | undefined', default: 'undefined', description: 'Date line' },
    { name: 'link', type: 'string', default: `'#'`, description: 'Share / fallback URL' },
    { name: 'variant', type: `'col' | 'row' | 'grid'`, default: `'col'`, description: 'Layout' },
    {
      name: 'size',
      type: `'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
      default: `'xl'`,
      description: 'Type and image scale (`xxs`/`xs` use `sm` article metrics)',
    },
    {
      name: 'rowImageHeightMode',
      type: `'full' | 'fixed'`,
      default: `'fixed'`,
      description: 'Row image height for xl/lg',
    },
    {
      name: 'rowIdentityPosition',
      type: `'top' | 'bottom'`,
      default: `'top'`,
      description: 'Publisher/author placement on row cards',
    },
    {
      name: 'rowMetaLayout',
      type: `'split' | 'inline'`,
      default: `'split'`,
      description: 'Date/actions under copy vs full-width under the row',
    },
    {
      name: 'rowImageAspect',
      type: `'default' | '3/2' | '1/1'`,
      default: `'1/1'`,
      description: 'Row image aspect ratio',
    },
    {
      name: 'rowImageAspectMd',
      type: `'default' | '3/2' | '1/1' | undefined`,
      default: 'undefined',
      description: 'Optional aspect override from the md breakpoint up',
    },
    { name: 'showBottomBorder', type: 'boolean', default: 'true', description: 'Bottom divider' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Skeleton state' },
    {
      name: 'metricsType',
      type: 'boolean',
      default: 'false',
      description: 'Show article reactions next to the date',
    },
    {
      name: 'articleMetrics',
      type: 'Record<string, unknown> | null',
      default: 'undefined',
      description: 'Emoji → count map for lz-articlecard-reactions',
    },
    {
      name: 'openArticleId',
      type: 'number | string | null',
      default: 'null',
      description: 'Payload emitted on title click',
    },
    {
      name: 'showActions',
      type: 'boolean',
      default: 'true',
      description: 'Watch later + more menu',
    },
    {
      name: 'isWatchLater',
      type: 'boolean',
      default: 'false',
      description: 'Watch-later active state',
    },
    {
      name: 'isSavedToList',
      type: 'boolean',
      default: 'false',
      description: 'Saved-to-list active state',
    },
    {
      name: 'isPublisherFollowed',
      type: 'boolean',
      default: 'false',
      description: 'Follow state shown in the more menu',
    },
    {
      name: 'isAuthorFollowed',
      type: 'boolean',
      default: 'false',
      description: 'Author follow state shown in the more menu',
    },
  ],
  outputs: [
    { name: 'openArticle', type: 'string | number | null', description: 'Title / image click' },
    { name: 'publisherClick', type: 'void', description: 'Publisher name click' },
    { name: 'authorClick', type: 'void', description: 'Author name click' },
    { name: 'watchLater', type: 'void', description: 'Watch-later toggle' },
    { name: 'saveToList', type: 'void', description: 'Save-to-list from more menu' },
    { name: 'share', type: 'void', description: 'Share from more menu' },
    { name: 'copyLink', type: 'void', description: 'Copy link from more menu' },
    { name: 'report', type: 'void', description: 'Report from more menu' },
    { name: 'publisherFollow', type: 'void', description: 'Follow publisher from more menu' },
    { name: 'authorFollow', type: 'void', description: 'Follow author from more menu' },
  ],
  slots: [],
  examples: [
    {
      title: 'Column article',
      code: `<lz-card
  publisher="AGORA"
  author="Ion Popescu"
  image="/cover.jpg"
  title="Headline"
  subtitle="Standfirst"
  date="17 Aug 2026"
  variant="col"
  size="xl"
/>`,
    },
    {
      title: 'Row · identity bottom · inline meta',
      code: `<lz-card
  variant="row"
  size="xl"
  rowIdentityPosition="bottom"
  rowMetaLayout="inline"
  rowImageAspect="3/2"
  [metricsType]="true"
  [articleMetrics]="{ '❤️': 12, '🔥': 4 }"
/>`,
    },
  ],
  tokens: [
    { name: '--lz-font-serif', description: 'Headline font' },
    { name: '--lz-font-sans', description: 'UI / standfirst font' },
    { name: '--lz-font-size-3-1xl', description: 'xl title size' },
  ],
};
