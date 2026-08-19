import { DocsComponentMeta } from '../../core/component-doc.model';

export const VIDEO_PLAYER_COMPONENT_META: DocsComponentMeta = {
  name: 'VideoPlayer',
  selector: 'lz-video-player',
  description:
    'Video.js player loaded from host /assets/videojs. Without a source or Video.js assets, a fallback message is shown.',
  controls: [{ name: 'videoSrc', kind: 'string', default: '' }],
  variants: [{ label: 'no source', props: { videoSrc: '' } }],
  inputs: [
    { name: 'videoSrc', type: 'string', default: `''`, description: 'MP4 URL' },
    {
      name: 'assetsPath',
      type: 'string',
      default: `'/assets/videojs'`,
      description: 'Base path for Video.js CSS/JS',
    },
    {
      name: 'playlist',
      type: 'LzVideoPlaylistItem[]',
      default: '[]',
      description: 'Nuevo playlist',
    },
    { name: 'autoplay', type: 'boolean', default: 'false', description: 'Autoplay' },
    { name: 'muted', type: 'boolean', default: 'true', description: 'Start muted' },
    { name: 'language', type: 'string', default: `'ro'`, description: 'Video.js language pack' },
  ],
  outputs: [],
  slots: [],
  examples: [
    {
      title: 'Host Video.js',
      code: `<lz-video-player videoSrc="/assets/video/intro.mp4" assetsPath="/assets/videojs" />`,
    },
  ],
  tokens: [{ name: '--lz-color-neutral-50', description: 'Fallback panel' }],
};
