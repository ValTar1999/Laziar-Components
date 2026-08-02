import { Component } from '@angular/core';
import { Checkbox } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { CHECKBOX_COMPONENT_META } from './checkbox.meta';

@Component({
  selector: 'docs-checkbox-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Checkbox],
  templateUrl: './checkbox-page.html',
})
export class CheckboxPage {
  protected readonly meta = CHECKBOX_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
