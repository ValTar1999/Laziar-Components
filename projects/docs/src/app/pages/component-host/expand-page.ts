import { Component } from '@angular/core';
import { Expand } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { EXPAND_COMPONENT_META } from './expand.meta';

@Component({
  selector: 'docs-expand-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Expand],
  templateUrl: './expand-page.html',
})
export class ExpandPage {
  protected readonly meta = EXPAND_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
