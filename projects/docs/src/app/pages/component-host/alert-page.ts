import { Component } from '@angular/core';
import { Alert } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { ALERT_COMPONENT_META } from './alert.meta';

@Component({
  selector: 'docs-alert-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Alert],
  templateUrl: './alert-page.html',
})
export class AlertPage {
  protected readonly meta = ALERT_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
