import { Component, signal } from '@angular/core';
import { LzRadioOption, RadioGroup } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { RADIO_GROUP_COMPONENT_META } from './radio-group.meta';

@Component({
  selector: 'docs-radio-group-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, RadioGroup],
  templateUrl: './radio-group-page.html',
})
export class RadioGroupPage {
  protected readonly meta = RADIO_GROUP_COMPONENT_META;
  protected readonly value = signal<unknown>('even');

  protected readonly options: LzRadioOption<string>[] = [
    {
      value: 'even',
      label: 'Evenly',
      icon: 'play',
      description: 'Spread impressions over the whole flight',
    },
    {
      value: 'fast',
      label: 'As fast as possible',
      icon: 'bolt',
      description: 'Deliver as quickly as inventory allows',
    },
    { value: 'manual', label: 'Manual', description: 'Not available yet', disabled: true },
  ];

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
