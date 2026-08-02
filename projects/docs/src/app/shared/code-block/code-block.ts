import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'docs-code-block',
  standalone: true,
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  private readonly transloco = inject(TranslocoService);

  readonly code = input.required<string>();
  readonly label = input('HTML');

  private readonly copied = signal(false);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly copyLabel = computed(() => {
    this.activeLang();
    return this.transloco.translate(this.copied() ? 'codeBlock.copied' : 'codeBlock.copy');
  });

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      window.setTimeout(() => this.copied.set(false), 1600);
    } catch {
      // clipboard may be denied
    }
  }
}
