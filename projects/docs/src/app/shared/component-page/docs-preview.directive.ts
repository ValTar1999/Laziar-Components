import { Directive, inject, TemplateRef } from '@angular/core';
import { DocsSandboxValues } from '../../core/component-doc.model';

/**
 * Marks the live preview template projected into `docs-component-page`.
 * Context: `$implicit` is the current sandbox values map.
 */
@Directive({
  selector: 'ng-template[docsPreview]',
  standalone: true,
})
export class DocsPreviewDirective {
  readonly templateRef = inject(TemplateRef<{ $implicit: DocsSandboxValues }>);
}
