import { Component, inject } from '@angular/core';
import { Button, ToastService, ToastType } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsStr } from './docs-page.helpers';
import { TOAST_COMPONENT_META } from './toast.meta';

@Component({
  selector: 'docs-toast-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Button],
  templateUrl: './toast-page.html',
})
export class ToastPage {
  private readonly toast = inject(ToastService);
  protected readonly meta = TOAST_COMPONENT_META;

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected show(values: DocsSandboxValues): void {
    this.toast.show({
      message: this.str(values, 'message', 'Site built from @laziar/components'),
      messageBold: this.str(values, 'messageBold', 'Done'),
      type: this.str(values, 'type', 'success') as ToastType,
    });
  }
}
