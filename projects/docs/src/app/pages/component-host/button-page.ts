import { Component } from '@angular/core';
import { Button } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { BUTTON_COMPONENT_META } from './button.meta';

@Component({
  selector: 'docs-button-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Button],
  templateUrl: './button-page.html',
})
export class ButtonPage {
  protected readonly meta = BUTTON_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    const v = values[key];
    return v === undefined || v === null ? fallback : String(v);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return Boolean(values[key]);
  }

  protected iconOf(values: DocsSandboxValues): string | undefined {
    const icon = this.str(values, 'icon').trim();
    return icon || undefined;
  }
}
