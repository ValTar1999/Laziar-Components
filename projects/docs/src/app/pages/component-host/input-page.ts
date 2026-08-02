import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, LzInputButtonPosition } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsOptStr, docsStr } from './docs-page.helpers';
import { INPUT_COMPONENT_META } from './input.meta';

@Component({
  selector: 'docs-input-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, FormsModule, InputComponent],
  templateUrl: './input-page.html',
})
export class InputPage {
  protected readonly meta = INPUT_COMPONENT_META;
  protected value = '';

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected optStr(values: DocsSandboxValues, key: string): string | undefined {
    return docsOptStr(values, key);
  }

  protected withButtonOf(values: DocsSandboxValues): LzInputButtonPosition | null {
    const raw = docsStr(values, 'withButton').trim();
    return raw === 'left' || raw === 'right' ? raw : null;
  }
}
