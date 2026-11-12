import { Component } from '@angular/core';
import { LoadingState } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { LOADING_STATE_COMPONENT_META } from './loading-state.meta';

@Component({
  selector: 'docs-loading-state-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, LoadingState],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <lz-loading-state [label]="str(values, 'label')" />
      </ng-template>
    </docs-component-page>
  `,
})
export class LoadingStatePage {
  protected readonly meta = LOADING_STATE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
