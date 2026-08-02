import { Component } from '@angular/core';
import { Icon } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { ICON_COMPONENT_META } from './icon.meta';

@Component({
  selector: 'docs-icon-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Icon],
  templateUrl: './icon-page.html',
})
export class IconPage {
  protected readonly meta = ICON_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
