import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TabButton } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { TAB_BUTTON_COMPONENT_META } from './tab-button.meta';

@Component({
  selector: 'docs-tab-button-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, TabButton],
  templateUrl: './tab-button-page.html',
})
export class TabButtonPage {
  private readonly transloco = inject(TranslocoService);

  protected readonly meta = TAB_BUTTON_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected overviewFallback(): string {
    return this.transloco.translate('components.tab-button.demo.overview');
  }
}
