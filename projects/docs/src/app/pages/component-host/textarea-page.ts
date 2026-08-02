import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaComponent } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsNum, docsStr } from './docs-page.helpers';
import { TEXTAREA_COMPONENT_META } from './textarea.meta';

@Component({
  selector: 'docs-textarea-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, FormsModule, TextareaComponent],
  templateUrl: './textarea-page.html',
})
export class TextareaPage {
  protected readonly meta = TEXTAREA_COMPONENT_META;
  protected value = '';

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected num(values: DocsSandboxValues, key: string, fallback = 0): number {
    return docsNum(values, key, fallback);
  }
}
