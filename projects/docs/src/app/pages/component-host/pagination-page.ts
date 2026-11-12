import { Component, signal } from '@angular/core';
import { PaginationComponent } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsNum, docsStr } from './docs-page.helpers';
import { PAGINATION_COMPONENT_META } from './pagination.meta';

@Component({
  selector: 'docs-pagination-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, PaginationComponent],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <lz-pagination
          [page]="current()"
          [totalPages]="num(values, 'totalPages', 12)"
          [size]="$any(str(values, 'size', 'md'))"
          [disabled]="bool(values, 'disabled')"
          [hideOnSinglePage]="bool(values, 'hideOnSinglePage')"
          (pageChange)="current.set($event)"
        />
      </ng-template>
    </docs-component-page>
  `,
})
export class PaginationPage {
  protected readonly meta = PAGINATION_COMPONENT_META;
  protected readonly current = signal(1);

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
