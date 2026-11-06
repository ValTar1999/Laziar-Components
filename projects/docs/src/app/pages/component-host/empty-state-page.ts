import { Component } from '@angular/core';
import { EmptyState } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsNum, docsOptStr, docsStr } from './docs-page.helpers';
import { EMPTY_STATE_COMPONENT_META } from './empty-state.meta';

@Component({
  selector: 'docs-empty-state-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, EmptyState],
  templateUrl: './empty-state-page.html',
})
export class EmptyStatePage {
  protected readonly meta = EMPTY_STATE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected optStr(values: DocsSandboxValues, key: string): string | undefined {
    return docsOptStr(values, key);
  }

  protected num(values: DocsSandboxValues, key: string, fallback = 0): number {
    return docsNum(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
