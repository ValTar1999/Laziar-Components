import { Component } from '@angular/core';
import { PulseDot } from '@laziar/components';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { PULSE_DOT_COMPONENT_META } from './pulse-dot.meta';

@Component({
  selector: 'docs-pulse-dot-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, PulseDot],
  templateUrl: './pulse-dot-page.html',
})
export class PulseDotPage {
  protected readonly meta = PULSE_DOT_COMPONENT_META;
}
