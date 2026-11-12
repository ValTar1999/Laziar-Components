import { Component } from '@angular/core';
import { PageHeader, Button, Badge, Tabs } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { PAGE_HEADER_COMPONENT_META } from './page-header.meta';

@Component({
  selector: 'docs-page-header-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, PageHeader, Button, Badge, Tabs],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <div style="width: 100%">
          <lz-page-header [heading]="str(values, 'heading')" [subtitle]="str(values, 'subtitle')">
            @if (bool(values, 'showAddon')) {
              <lz-badge lzPageHeaderTitleAddon size="xs">12</lz-badge>
            }
            @if (bool(values, 'showActions')) {
              <lz-button lzPageHeaderActions label="Create" size="sm" [pill]="true" />
            }
            @if (bool(values, 'showTabs')) {
              <lz-tabs lzPageHeaderTabs [tabs]="tabs" [style]="'underline'" ariaLabel="Content" />
            }
          </lz-page-header>
        </div>
      </ng-template>
    </docs-component-page>
  `,
})
export class PageHeaderPage {
  protected readonly meta = PAGE_HEADER_COMPONENT_META;
  protected readonly tabs = ['All', 'Published', 'Drafts'];

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
