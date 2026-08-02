import { Component } from '@angular/core';
import { Loading } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { LOADING_COMPONENT_META } from './loading.meta';

@Component({
  selector: 'docs-loading-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Loading],
  templateUrl: './loading-page.html',
})
export class LoadingPage {
  protected readonly meta = LOADING_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
