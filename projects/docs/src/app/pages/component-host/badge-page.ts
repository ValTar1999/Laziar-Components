import { Component } from '@angular/core';
import { Badge } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsOptStr, docsStr } from './docs-page.helpers';
import { BADGE_COMPONENT_META } from './badge.meta';

@Component({
  selector: 'docs-badge-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Badge],
  templateUrl: './badge-page.html',
})
export class BadgePage {
  protected readonly meta = BADGE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected optStr(values: DocsSandboxValues, key: string): string | undefined {
    return docsOptStr(values, key);
  }
}
