import { Component } from '@angular/core';
import { Calendar } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { CALENDAR_COMPONENT_META, CALENDAR_DATE_PATTERN } from './calendar.meta';

@Component({
  selector: 'docs-calendar-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Calendar],
  templateUrl: './calendar-page.html',
})
export class CalendarPage {
  protected readonly meta = CALENDAR_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  /** Sandbox dates are `yyyy-mm-dd [hh:mm]` strings; anything else means no date. */
  protected date(values: DocsSandboxValues, key: string): Date | null {
    const m = CALENDAR_DATE_PATTERN.exec(docsStr(values, key).trim());
    if (!m) return null;
    const [year, month, day, hours, minutes] = m.slice(1).map((part) => Number(part ?? 0));
    return new Date(year, month - 1, day, hours, minutes);
  }
}
