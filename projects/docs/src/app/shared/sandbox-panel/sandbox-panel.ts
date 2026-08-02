import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  InputComponent,
  LzSelectOptionType,
  SelectComponent,
  SwitchToggle,
} from '@laziar/components';
import { DocsSandboxControl, DocsSandboxValues } from '../../core/component-doc.model';
import { DocsTranslatePipe } from '../docs-translate.pipe';

@Component({
  selector: 'docs-sandbox-panel',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    SelectComponent,
    SwitchToggle,
    TranslocoPipe,
    DocsTranslatePipe,
  ],
  templateUrl: './sandbox-panel.html',
  styleUrl: './sandbox-panel.scss',
})
export class SandboxPanel {
  readonly controls = input.required<DocsSandboxControl[]>();
  readonly values = input.required<DocsSandboxValues>();
  readonly docId = input.required<string>();
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

  protected asNumberString(name: string): string {
    return String(this.values()[name] ?? 0);
  }

  protected selectOptions(control: DocsSandboxControl): LzSelectOptionType[] {
    return [...(control.options ?? [])];
  }

  protected onSelect(name: string, value: unknown): void {
    this.update(name, String(value ?? ''));
  }

  protected onNumberInput(name: string, value: string): void {
    const n = Number(value);
    this.update(name, Number.isFinite(n) ? n : 0);
  }
}
