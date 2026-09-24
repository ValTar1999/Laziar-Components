import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

/**
 * Highlighted article note.
 * Ported from frontend `app-block-note-panel` without `ArticleRenderBlock`.
 */
@Component({
  selector: 'lz-note-panel',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './note-panel.component.html',
  styleUrl: './note-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-note-panel-host',
  },
})
export class NotePanel {
  /** Note body. CMS HTML, same as frontend `block.blockContent`. */
  readonly content = input('');
}
