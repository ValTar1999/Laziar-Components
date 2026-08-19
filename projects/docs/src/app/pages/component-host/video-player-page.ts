import { Component } from '@angular/core';
import { VideoPlayer } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { VIDEO_PLAYER_COMPONENT_META } from './video-player.meta';

@Component({
  selector: 'docs-video-player-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, VideoPlayer],
  templateUrl: './video-player-page.html',
})
export class VideoPlayerPage {
  protected readonly meta = VIDEO_PLAYER_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
