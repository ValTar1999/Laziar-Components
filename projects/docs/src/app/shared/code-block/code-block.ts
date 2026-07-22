import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'docs-code-block',
  standalone: true,
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly label = input('HTML');

  private readonly copied = signal(false);
  protected readonly copyLabel = computed(() => (this.copied() ? 'Скопировано' : 'Копировать'));

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
