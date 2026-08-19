import { Component } from '@angular/core';
import { AuthFooter } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { AUTH_FOOTER_COMPONENT_META } from './auth-footer.meta';

@Component({
  selector: 'docs-auth-footer-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, AuthFooter],
  templateUrl: './auth-footer-page.html',
})
export class AuthFooterPage {
  protected readonly meta = AUTH_FOOTER_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
