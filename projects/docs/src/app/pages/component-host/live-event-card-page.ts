import { Component } from '@angular/core';
import { LiveEventCard, LzLiveEventCardEntry, LzLiveEventCardSize } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { LIVE_EVENT_CARD_COMPONENT_META } from './live-event-card.meta';

@Component({
  selector: 'docs-live-event-card-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, LiveEventCard],
  templateUrl: './live-event-card-page.html',
})
export class LiveEventCardPage {
  protected readonly meta = LIVE_EVENT_CARD_COMPONENT_META;
  protected readonly entries: LzLiveEventCardEntry[] = [
    { time: '12:01', text: 'Kick-off' },
    { time: '12:18', text: 'Goal' },
  ];

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected size(values: DocsSandboxValues): LzLiveEventCardSize {
    return this.str(values, 'size', 'sm') as LzLiveEventCardSize;
  }
}
