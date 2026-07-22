import { Component, computed, input, output } from '@angular/core';
import { DocsSandboxControl, DocsSandboxValues } from '../../core/component-doc.model';

@Component({
  selector: 'docs-sandbox-panel',
  standalone: true,
  templateUrl: './sandbox-panel.html',
  styleUrl: './sandbox-panel.scss',
})
export class SandboxPanel {
  readonly controls = input.required<DocsSandboxControl[]>();
  readonly values = input.required<DocsSandboxValues>();
  readonly valuesChange = output<DocsSandboxValues>();

  protected readonly entries = computed(() => this.controls());

  protected update(name: string, value: string | boolean | number): void {
    this.valuesChange.emit({ ...this.values(), [name]: value });
  }

  protected asString(name: string): string {
    return String(this.values()[name] ?? '');
  }

  protected asBoolean(name: string): boolean {
    return Boolean(this.values()[name]);
  }

  protected asNumber(name: string): number {
    return Number(this.values()[name] ?? 0);
  }

  protected onString(name: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.update(name, target.value);
  }

  protected onNumber(name: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.update(name, target.valueAsNumber);
  }

  protected onBoolean(name: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.update(name, target.checked);
  }
}
