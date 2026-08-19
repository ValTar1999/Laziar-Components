import { Component } from '@angular/core';
import { LzMoreActionsMenuLayout, MoreActionsMenu } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { MORE_ACTIONS_MENU_COMPONENT_META } from './more-actions-menu.meta';

@Component({
  selector: 'docs-more-actions-menu-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, MoreActionsMenu],
  templateUrl: './more-actions-menu-page.html',
})
export class MoreActionsMenuPage {
  protected readonly meta = MORE_ACTIONS_MENU_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected layout(values: DocsSandboxValues): LzMoreActionsMenuLayout {
    return this.str(values, 'layout', 'desktop') as LzMoreActionsMenuLayout;
  }
}
