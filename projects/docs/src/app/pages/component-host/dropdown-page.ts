import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { DropdownComponent, LzDropdownSection } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { DROPDOWN_COMPONENT_META } from './dropdown.meta';

@Component({
  selector: 'docs-dropdown-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, DropdownComponent],
  templateUrl: './dropdown-page.html',
})
export class DropdownPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly meta = DROPDOWN_COMPONENT_META;

  protected readonly sections = computed((): LzDropdownSection[] => {
    this.activeLang();
    return [
      {
        heading: this.transloco.translate('components.dropdown.demo.account'),
        items: [
          this.transloco.translate('components.dropdown.demo.profile'),
          this.transloco.translate('components.dropdown.demo.settings'),
        ],
      },
      {
        heading: this.transloco.translate('components.dropdown.demo.actions'),
        items: [
          this.transloco.translate('components.dropdown.demo.archive'),
          this.transloco.translate('components.dropdown.demo.delete'),
        ],
      },
    ];
  });

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
