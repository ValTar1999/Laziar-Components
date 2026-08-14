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
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { LzSelectSize, LzSelectOptionType } from './select.types';
import { Icon } from '../icon/icon.component';

let nextSelectFieldId = 0;

const DROPDOWN_OFFSET_PX = 8;
const DROPDOWN_VIEWPORT_PADDING_PX = 8;
const DROPDOWN_MAX_HEIGHT_PX = 208;

/** CDK portal only — coordinates come from Floating UI. */
function floatingUiPositionStrategy(): PositionStrategy {
  return {
    attach: () => undefined,
    apply: () => undefined,
    detach: () => undefined,
    dispose: () => undefined,
  };
}

/**
 * Select field `@laziar/components`.
 * API — эталон publikator (`SelectComponent`).
 * Стили — эталон Laziar System (Figma Select Input).
 */
@Component({
  selector: 'lz-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [CommonModule, Icon, OverlayModule],
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
export class SelectComponent implements ControlValueAccessor, OnDestroy {
  private readonly eRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input('Select...');
  readonly options = input<LzSelectOptionType[]>([]);
  readonly size = input<LzSelectSize>('md');
  readonly helperText = input<string | undefined>(undefined);
  readonly error = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly opened = output<void>();

  readonly selectId = `lz-select-${nextSelectFieldId++}`;
  readonly listboxId = `${this.selectId}-listbox`;
  readonly paneClass = 'lz-select-cdk-pane';

  @ViewChild('trigger', { static: true })
  private trigger?: ElementRef<HTMLButtonElement>;

  @ViewChild('dropdownTpl', { static: true })
  private dropdownTpl?: TemplateRef<unknown>;

  protected readonly isOpen = signal(false);
  protected readonly selected = signal<LzSelectOptionType | null>(null);

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: LzSelectOptionType | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private overlayRef?: OverlayRef;
  private floatingCleanup?: () => void;

  protected readonly displayValue = computed(() => {
    const selectedValue = this.selected();
    if (!selectedValue) return '';
    return typeof selectedValue === 'string' ? selectedValue : selectedValue.title;
  });

  ngOnDestroy(): void {
    this.teardownOverlay();
  }

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
      this.closeDropdown();
    }
  }

  protected toggleDropdown(): void {
    if (this.effectiveDisabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  protected selectOption(option: LzSelectOptionType): void {
    this.selected.set(option);
    this.closeDropdown();
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

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.closeDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  protected clickOutside(event: Event): void {
    if (!this.isOpen()) return;

    const target = event.target as Node | null;
    if (!target) return;
    if (this.eRef.nativeElement.contains(target)) return;
    if (this.overlayRef?.overlayElement.contains(target)) return;

    this.closeDropdown();
    this.onTouched();
  }

  private openDropdown(): void {
    if (this.isOpen() || this.effectiveDisabled()) return;

    this.isOpen.set(true);
    this.attachOverlay();
    this.opened.emit();
  }

  private closeDropdown(): void {
    this.isOpen.set(false);
    this.detachOverlay();
  }

  private attachOverlay(): void {
    const tpl = this.dropdownTpl;
    if (!tpl) return;

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        panelClass: this.paneClass,
        positionStrategy: floatingUiPositionStrategy(),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(new TemplatePortal(tpl, this.vcr));
    }

    this.startFloating();
  }

  private detachOverlay(): void {
    this.stopFloating();
    this.overlayRef?.detach();
  }

  private teardownOverlay(): void {
    this.stopFloating();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  private startFloating(): void {
    this.stopFloating();

    const reference = this.trigger?.nativeElement;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) return;

    this.floatingCleanup = autoUpdate(reference, floating, () => {
      void this.positionDropdown(reference, floating);
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }

  private async positionDropdown(reference: HTMLElement, floating: HTMLElement): Promise<void> {
    const { x, y } = await computePosition(reference, floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [
        offset(DROPDOWN_OFFSET_PX),
        flip({ padding: DROPDOWN_VIEWPORT_PADDING_PX }),
        shift({ padding: DROPDOWN_VIEWPORT_PADDING_PX }),
        size({
          padding: DROPDOWN_VIEWPORT_PADDING_PX,
          apply({ rects, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${Math.min(DROPDOWN_MAX_HEIGHT_PX, Math.max(0, availableHeight))}px`,
            });
          },
        }),
      ],
    });

    Object.assign(floating.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
    });
  }
}
