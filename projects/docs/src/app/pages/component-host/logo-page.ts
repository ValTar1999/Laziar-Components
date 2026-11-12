import { Component } from '@angular/core';
import { Logo } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { LOGO_COMPONENT_META } from './logo.meta';

@Component({
  selector: 'docs-logo-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Logo],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <lz-logo
          [link]="str(values, 'link', '/') || '/'"
          [ariaLabel]="str(values, 'ariaLabel', 'Laziar home')"
        />
      </ng-template>
    </docs-component-page>
  `,
})
export class LogoPage {
  protected readonly meta = LOGO_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
