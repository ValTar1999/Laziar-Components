import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { Tabs } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsNum, docsStr } from './docs-page.helpers';
import { TABS_COMPONENT_META } from './tabs.meta';

@Component({
  selector: 'docs-tabs-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Tabs],
  templateUrl: './tabs-page.html',
})
export class TabsPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly meta = TABS_COMPONENT_META;

  protected readonly tabs = computed(() => {
    this.activeLang();
    return [
      this.transloco.translate('components.tabs.demo.overview'),
      this.transloco.translate('components.tabs.demo.members'),
      this.transloco.translate('components.tabs.demo.settings'),
    ];
  });

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected num(values: DocsSandboxValues, key: string, fallback = 0): number {
    return docsNum(values, key, fallback);
  }
}
