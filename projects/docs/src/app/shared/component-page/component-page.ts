import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  DocsComponentMeta,
  DocsSandboxValues,
  defaultsFromControls,
  generateTemplateCode,
  resolveSnippetContent,
} from '../../core/component-doc.model';
import { docsComponentId, docsKeySegment } from '../../core/docs-i18n';
import { CodeBlock } from '../code-block/code-block';
import { DocsTranslatePipe } from '../docs-translate.pipe';
import { SandboxPanel } from '../sandbox-panel/sandbox-panel';
import { DocsPreviewDirective } from './docs-preview.directive';

@Component({
  selector: 'docs-component-page',
  standalone: true,
  imports: [NgTemplateOutlet, CodeBlock, SandboxPanel, TranslocoPipe, DocsTranslatePipe],
  templateUrl: './component-page.html',
  styleUrl: './component-page.scss',
})
export class ComponentPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });
  private readonly translation = toSignal(this.transloco.selectTranslation());

  readonly meta = input.required<DocsComponentMeta>();

  private readonly previewDir = contentChild(DocsPreviewDirective);

  protected readonly previewTpl = computed(() => this.previewDir()?.templateRef ?? null);

  protected readonly docId = computed(() => docsComponentId(this.meta().selector));

  /** Resets when `meta`, language, or loaded translations change; updated live by the sandbox. */
  protected readonly values = linkedSignal<DocsSandboxValues>(() => {
    this.activeLang();
    this.translation();
    return this.translatedDefaults();
  });

  protected readonly previewCtx = computed(() => ({ $implicit: this.values() }));

  protected readonly liveCode = computed(() => this.snippetFor(this.values()));

  protected readonly deprecatedOpen = signal(false);

  protected keySeg(name: string): string {
    return docsKeySegment(name);
  }

  protected onValues(next: DocsSandboxValues): void {
    this.values.set(next);
  }

  protected variantCode(props: DocsSandboxValues, explicit?: string): string {
    return explicit ?? this.snippetFor(props);
  }

  private translatedDefaults(): DocsSandboxValues {
    const meta = this.meta();
    const id = docsComponentId(meta.selector);
    const base = defaultsFromControls(meta.controls);
    const next: DocsSandboxValues = { ...base };

    for (const control of meta.controls) {
      if (typeof control.default !== 'string' || !control.default) {
        continue;
      }
      const key = `components.${id}.controls.${control.name}.default`;
      const translated = this.transloco.translate(key);
      if (translated !== key) {
        next[control.name] = translated;
      }
    }

    return next;
  }

  private snippetFor(values: DocsSandboxValues): string {
    const meta = this.meta();
    const skip = [
      ...(meta.contentFrom ? [meta.contentFrom] : []),
      ...(meta.snippetIgnore ?? []),
    ];
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
