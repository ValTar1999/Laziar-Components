import { Component } from '@angular/core';
import { NavItem } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { NAV_ITEM_COMPONENT_META } from './nav-item.meta';

@Component({
  selector: 'docs-nav-item-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, NavItem],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <div [style.width]="bool(values, 'collapsed') ? '3.5rem' : '16rem'">
          <button
            lz-nav-item
            type="button"
            [icon]="str(values, 'icon', 'megaphone') || undefined"
            [active]="bool(values, 'active')"
            [collapsed]="bool(values, 'collapsed')"
            title="Campaigns"
          >
            Campaigns
          </button>
        </div>
      </ng-template>
    </docs-component-page>
  `,
})
export class NavItemPage {
  protected readonly meta = NAV_ITEM_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
