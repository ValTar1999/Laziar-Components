import { Component, signal } from '@angular/core';
import {
  Button,
  LzModalSize,
  LzModalTone,
  LzModalVariant,
  ModalComponent,
} from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsOptStr, docsStr } from './docs-page.helpers';
import { MODAL_COMPONENT_META } from './modal.meta';

@Component({
  selector: 'docs-modal-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Button, ModalComponent],
  templateUrl: './modal-page.html',
})
export class ModalPage {
  protected readonly meta = MODAL_COMPONENT_META;
  /**
   * The preview template renders once in the sandbox and once per variant
   * card, so the open state is keyed by that instance's values object —
   * a shared boolean would open every copy at once.
   */
  protected readonly openFor = signal<DocsSandboxValues | null>(null);

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  /** Empty sandbox strings mean "not set" so the modal falls back to its defaults. */
  protected optStr(values: DocsSandboxValues, key: string): string | undefined {
    return docsOptStr(values, key) || undefined;
  }

  protected bool(values: DocsSandboxValues, key: string): boolean {
    return docsBool(values, key);
  }

  protected variant(values: DocsSandboxValues): LzModalVariant {
    return this.str(values, 'variant', 'default') as LzModalVariant;
  }

  protected size(values: DocsSandboxValues): LzModalSize {
    return this.str(values, 'size', 'md') as LzModalSize;
  }

  protected tone(values: DocsSandboxValues): LzModalTone {
    return this.str(values, 'tone', 'danger') as LzModalTone;
  }
}
