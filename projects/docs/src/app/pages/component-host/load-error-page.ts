import { Component } from '@angular/core';
import { LoadError } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { LOAD_ERROR_COMPONENT_META } from './load-error.meta';

@Component({
  selector: 'docs-load-error-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, LoadError],
  templateUrl: './load-error-page.html',
})
export class LoadErrorPage {
  protected readonly meta = LOAD_ERROR_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
