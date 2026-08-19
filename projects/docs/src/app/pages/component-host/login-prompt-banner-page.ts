import { Component } from '@angular/core';
import { LoginPromptBanner } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { LOGIN_PROMPT_BANNER_COMPONENT_META } from './login-prompt-banner.meta';

@Component({
  selector: 'docs-login-prompt-banner-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, LoginPromptBanner],
  templateUrl: './login-prompt-banner-page.html',
})
export class LoginPromptBannerPage {
  protected readonly meta = LOGIN_PROMPT_BANNER_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }
}
