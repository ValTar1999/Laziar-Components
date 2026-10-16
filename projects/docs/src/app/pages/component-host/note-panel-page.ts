import { Component } from '@angular/core';
import { NotePanel } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { NOTE_PANEL_COMPONENT_META } from './note-panel.meta';

@Component({
  selector: 'docs-note-panel-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, NotePanel],
  templateUrl: './note-panel-page.html',
})
export class NotePanelPage {
  protected readonly meta = NOTE_PANEL_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
