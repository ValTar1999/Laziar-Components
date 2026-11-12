import { Component, signal } from '@angular/core';
import { DateInput } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { DATE_INPUT_COMPONENT_META } from './date-input.meta';

@Component({
  selector: 'docs-date-input-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, DateInput],
  template: `
    <docs-component-page [meta]="meta">
      <ng-template docsPreview let-values>
        <div style="width: 18rem">
          <lz-date-input
            [label]="str(values, 'label', 'Start date')"
            [size]="$any(str(values, 'size', 'md'))"
            [helperText]="str(values, 'helperText') || undefined"
            [error]="bool(values, 'error')"
            [disabled]="bool(values, 'disabled')"
            [value]="value()"
            (valueChange)="value.set($event)"
          />
        </div>
      </ng-template>
    </docs-component-page>
  `,
})
export class DateInputPage {
  protected readonly meta = DATE_INPUT_COMPONENT_META;
  protected readonly value = signal<string | null>(null);

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
