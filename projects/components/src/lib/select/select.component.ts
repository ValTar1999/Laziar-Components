import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LzSelectSize, LzSelectOptionType } from './select.types';
import { Icon } from '../icon/icon.component';

let nextSelectFieldId = 0;

/**
 * Select field `@laziar/components`.
 * API/стили — эталон publikator (`SelectComponent`).
 */
@Component({
  selector: 'lz-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [CommonModule, Icon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  host: {
    class: 'lz-select-host',
  },
})
export class SelectComponent implements ControlValueAccessor {
  private readonly eRef = inject(ElementRef<HTMLElement>);

  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input('Select...');
  readonly options = input<LzSelectOptionType[]>([]);
  readonly size = input<LzSelectSize>('md');
  readonly helperText = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly opened = output<void>();

  readonly selectId = `lz-select-${nextSelectFieldId++}`;

  protected readonly isOpen = signal(false);
  protected readonly selected = signal<LzSelectOptionType | null>(null);

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: LzSelectOptionType | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly displayValue = computed(() => {
    const selectedValue = this.selected();
    if (!selectedValue) return '';
    return typeof selectedValue === 'string' ? selectedValue : selectedValue.title;
  });

  writeValue(value: LzSelectOptionType | null): void {
    this.selected.set(value);
  }

  registerOnChange(fn: (value: LzSelectOptionType | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    if (isDisabled) {
      this.isOpen.set(false);
    }
  }

  protected toggleDropdown(): void {
    if (this.effectiveDisabled()) return;

    const newState = !this.isOpen();
    this.isOpen.set(newState);

    if (newState) {
      this.opened.emit();
    }
  }

  protected selectOption(option: LzSelectOptionType): void {
    this.selected.set(option);
    this.isOpen.set(false);
    this.onChange(option);
    this.onTouched();
  }

  protected onOptionKeydown(event: Event, option: LzSelectOptionType): void {
    const key = (event as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;
    event.preventDefault();
    this.selectOption(option);
  }

  protected getOptionTitle(option: LzSelectOptionType): string {
    return typeof option === 'string' ? option : option.title;
  }

  protected getOptionDate(option: LzSelectOptionType): string | null {
    return typeof option === 'string' ? null : option.date;
  }

  protected formatOptionDate(option: LzSelectOptionType): string | null {
    const rawDate = this.getOptionDate(option);
    if (!rawDate) return null;

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return rawDate;
    }

    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsedDate);
  }

  protected isSelected(option: LzSelectOptionType): boolean {
    const selectedValue = this.selected();
    if (selectedValue === null) return false;

    if (typeof option === 'string' && typeof selectedValue === 'string') {
      return option === selectedValue;
    }

    if (typeof option !== 'string' && typeof selectedValue !== 'string') {
      return option.title === selectedValue.title;
    }

    return false;
  }

  @HostListener('document:click', ['$event'])
  protected clickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
