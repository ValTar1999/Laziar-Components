import { Component } from '@angular/core';
import { Button, PageHeader, Tabs } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { PAGE_HEADER_COMPONENT_META } from './page-header.meta';

@Component({
  selector: 'docs-page-header-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, PageHeader, Button, Tabs],
  templateUrl: './page-header-page.html',
})
export class PageHeaderPage {
  protected readonly meta = PAGE_HEADER_COMPONENT_META;
  protected readonly tabs = ['Videoclipuri', 'Playlisturi', 'Short-uri'];

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
