import { Component } from '@angular/core';
import { EmptyState } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { EMPTY_STATE_COMPONENT_META } from './empty-state.meta';

@Component({
  selector: 'docs-empty-state-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, EmptyState],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <lz-empty-state
          [heading]="str(values, 'heading')"
          [description]="str(values, 'description')"
          [icon]="str(values, 'icon', 'inbox') || 'inbox'"
          [actionLabel]="str(values, 'actionLabel')"
          [actionIcon]="str(values, 'actionIcon') || undefined"
          [fullPage]="bool(values, 'fullPage')"
        />
      </ng-template>
    </docs-component-page>
  `,
})
export class EmptyStatePage {
  protected readonly meta = EMPTY_STATE_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
