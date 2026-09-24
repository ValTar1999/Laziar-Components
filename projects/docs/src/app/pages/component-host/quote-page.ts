import { Component } from '@angular/core';
import { LzQuoteAuthor, Quote } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { QUOTE_COMPONENT_META } from './quote.meta';

@Component({
  selector: 'docs-quote-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Quote],
  templateUrl: './quote-page.html',
})
export class QuotePage {
  protected readonly meta = QUOTE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected author(values: DocsSandboxValues): LzQuoteAuthor | null {
    const fullName = this.str(values, 'authorName').trim();
    const position = this.str(values, 'authorPosition').trim();
    const avatarUrl = this.str(values, 'authorAvatar').trim();
    if (!fullName && !position && !avatarUrl) {
      return null;
    }
    return {
      fullName: fullName || undefined,
      position: position || undefined,
      avatarUrl: avatarUrl || undefined,
    };
  }
}
