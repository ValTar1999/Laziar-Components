import { Component } from '@angular/core';
import { SwitchToggle } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { SWITCH_TOGGLE_COMPONENT_META } from './switch-toggle.meta';

@Component({
  selector: 'docs-switch-toggle-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, SwitchToggle],
  templateUrl: './switch-toggle-page.html',
})
export class SwitchTogglePage {
  protected readonly meta = SWITCH_TOGGLE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
