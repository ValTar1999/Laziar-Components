import { Component } from '@angular/core';
import { LoadError } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { LOAD_ERROR_COMPONENT_META } from './load-error.meta';

@Component({
  selector: 'docs-load-error-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, LoadError],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <div style="width: 100%; max-width: 36rem">
          <lz-load-error
            [heading]="str(values, 'heading')"
            [text]="str(values, 'text')"
            [retryLabel]="str(values, 'retryLabel')"
          />
        </div>
      </ng-template>
    </docs-component-page>
  `,
})
export class LoadErrorPage {
  protected readonly meta = LOAD_ERROR_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
