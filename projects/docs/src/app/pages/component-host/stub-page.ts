import { Component } from '@angular/core';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { STUB_COMPONENT_META } from './stub.meta';

@Component({
  selector: 'docs-stub-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective],
  templateUrl: './stub-page.html',
  styleUrl: './stub-page.scss',
})
export class StubPage {
  protected readonly meta = STUB_COMPONENT_META;

  protected labelOf(values: DocsSandboxValues): string {
    return String(values['label'] ?? '');
  }

  protected variantOf(values: DocsSandboxValues): string {
    return String(values['variant'] ?? 'primary');
  }

  protected sizeOf(values: DocsSandboxValues): string {
    return String(values['size'] ?? 'md');
  }

  protected disabledOf(values: DocsSandboxValues): boolean {
    return Boolean(values['disabled']);
  }

  protected accentOf(values: DocsSandboxValues): string {
    return String(values['accent'] ?? '#d50b0b');
  }

  protected maxWidthOf(values: DocsSandboxValues): string {
    return `${Number(values['maxWidth'] ?? 280)}px`;
  }
}
