import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Tooltip } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { TOOLTIP_COMPONENT_META } from './tooltip.meta';

@Component({
  selector: 'docs-tooltip-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Tooltip, TranslocoPipe],
  templateUrl: './tooltip-page.html',
})
export class TooltipPage {
  protected readonly meta = TOOLTIP_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
