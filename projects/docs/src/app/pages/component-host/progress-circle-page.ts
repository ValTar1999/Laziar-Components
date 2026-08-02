import { Component } from '@angular/core';
import { ProgressCircle } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsNum, docsStr } from './docs-page.helpers';
import { PROGRESS_CIRCLE_COMPONENT_META } from './progress-circle.meta';

@Component({
  selector: 'docs-progress-circle-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, ProgressCircle],
  templateUrl: './progress-circle-page.html',
})
export class ProgressCirclePage {
  protected readonly meta = PROGRESS_CIRCLE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected num(values: DocsSandboxValues, key: string, fallback = 0): number {
    return docsNum(values, key, fallback);
  }
}
