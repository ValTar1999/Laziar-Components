import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, input, linkedSignal, signal } from '@angular/core';
import {
  DocsComponentMeta,
  DocsSandboxValues,
  defaultsFromControls,
  generateTemplateCode,
  resolveSnippetContent,
} from '../../core/component-doc.model';
import { CodeBlock } from '../code-block/code-block';
import { SandboxPanel } from '../sandbox-panel/sandbox-panel';
import { DocsPreviewDirective } from './docs-preview.directive';

@Component({
  selector: 'docs-component-page',
  standalone: true,
  imports: [NgTemplateOutlet, CodeBlock, SandboxPanel],
  templateUrl: './component-page.html',
  styleUrl: './component-page.scss',
})
export class ComponentPage {
  readonly meta = input.required<DocsComponentMeta>();

  private readonly previewDir = contentChild(DocsPreviewDirective);

  protected readonly previewTpl = computed(() => this.previewDir()?.templateRef ?? null);

  /** Resets when `meta` changes; updated live by the sandbox. */
  protected readonly values = linkedSignal<DocsSandboxValues>(() =>
    defaultsFromControls(this.meta().controls),
  );

  protected readonly previewCtx = computed(() => ({ $implicit: this.values() }));

  protected readonly liveCode = computed(() => this.snippetFor(this.values()));

  protected readonly deprecatedOpen = signal(false);

  protected onValues(next: DocsSandboxValues): void {
    this.values.set(next);
  }

  protected variantCode(props: DocsSandboxValues, explicit?: string): string {
    return explicit ?? this.snippetFor(props);
  }

  private snippetFor(values: DocsSandboxValues): string {
    const meta = this.meta();
    const skip = meta.contentFrom ? [meta.contentFrom] : [];
    return generateTemplateCode(
      meta.selector,
      values,
      meta.controls,
      resolveSnippetContent(meta, values),
      skip,
    );
  }

  protected toggleDeprecated(): void {
    this.deprecatedOpen.update((v) => !v);
  }
}
