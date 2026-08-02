import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { SelectComponent } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { SELECT_COMPONENT_META } from './select.meta';

@Component({
  selector: 'docs-select-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, FormsModule, SelectComponent],
  templateUrl: './select-page.html',
})
export class SelectPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly meta = SELECT_COMPONENT_META;
  protected value = '';

  protected readonly options = computed(() => {
    this.activeLang();
    return [
      this.transloco.translate('components.select.demo.optionA'),
      this.transloco.translate('components.select.demo.optionB'),
      this.transloco.translate('components.select.demo.optionC'),
    ];
  });

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
