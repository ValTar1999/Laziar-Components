import { Component } from '@angular/core';
import { LanguageDropdown } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { LANGUAGE_DROPDOWN_COMPONENT_META } from './language-dropdown.meta';

@Component({
  selector: 'docs-language-dropdown-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, LanguageDropdown],
  templateUrl: './language-dropdown-page.html',
})
export class LanguageDropdownPage {
  protected readonly meta = LANGUAGE_DROPDOWN_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
