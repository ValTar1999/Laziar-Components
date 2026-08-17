import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LzTextareaResize } from './textarea.types';
import { Icon } from '../icon/icon.component';

let nextTextareaFieldId = 0;

/**
 * Textarea field `@laziar/components`.
 * Стили — эталон Laziar System (Figma Text Input / Textarea).
 */
@Component({
  selector: 'lz-textarea',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  imports: [CommonModule, Icon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  host: {
    class: 'lz-textarea-host',
  },
})
export class TextareaComponent implements ControlValueAccessor {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input('');
  readonly rows = input(4, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly helperText = input<string | undefined>(undefined);
  readonly error = input(false, { transform: booleanAttribute });
  readonly resize = input<LzTextareaResize>('vertical');

  readonly valueChange = output<string>();

  readonly textareaId = `lz-textarea-${nextTextareaFieldId++}`;

  protected readonly value = signal('');

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const newValue = textarea.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
