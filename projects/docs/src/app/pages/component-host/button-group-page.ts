import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button, ButtonGroup } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool } from './docs-page.helpers';
import { BUTTON_GROUP_COMPONENT_META } from './button-group.meta';

@Component({
  selector: 'docs-button-group-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, ButtonGroup, Button, TranslocoPipe],
  templateUrl: './button-group-page.html',
})
export class ButtonGroupPage {
  protected readonly meta = BUTTON_GROUP_COMPONENT_META;

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }
}
