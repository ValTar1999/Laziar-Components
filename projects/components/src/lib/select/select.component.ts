import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EmbeddedViewRef,
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
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { attachLzFloating } from '../floating/floating';
import {
  LzSelectSize,
  LzSelectOptionType,
  LzSelectSummaryFn,
  lzSelectOptionDate,
  lzSelectOptionLabel,
} from './select.types';
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
 * Whether two options are the same choice: by `id` when both have one, else by
 * `value`, else by label. Options are often rebuilt by the app, so identity alone
 * would drop a selection the moment its option object is recreated.
 */
function sameOption(a: LzSelectOptionType, b: LzSelectOptionType): boolean {
  if (typeof a === 'string' || typeof b === 'string') {
    return a === b;
  }
  if (a.id != null && b.id != null) {
    return a.id === b.id;
  }
  if (a.value != null && b.value != null) {
    return a.value === b.value;
  }
  return lzSelectOptionLabel(a) === lzSelectOptionLabel(b);
}

/**
 * Select field `@laziar/components`.
 * API — эталон publikator (`SelectComponent`).
 * Стили — эталон Laziar System (Figma Select Input).
 *
 * With `multiple` the value is an array of options: each click toggles one, the
 * list stays open, and the options carry checkboxes.
 */
@Component({
  selector: 'lz-select',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [Icon, OverlayModule],
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
  /** Adds a search box above the options that filters them by title and date. */
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Search');
  /** Shown in place of the options when a search matches none of them. */
  readonly noResultsText = input('No results');
  /**
   * Lets several options be chosen. The value written and emitted is then an
   * array of options (`[]` when none), and picking an option toggles it without
   * closing the list.
   */
  readonly multiple = input(false, { transform: booleanAttribute });
  /**
   * `multiple` only: the trigger text for the options chosen. Defaults to their
   * labels joined by commas.
   */
  readonly selectionSummary = input<LzSelectSummaryFn | null>(null);

  readonly opened = output<void>();

  protected readonly searchQuery = signal('');
  protected readonly filteredOptions = computed(() => {
    const options = this.options();
    const query = this.searchQuery().trim().toLowerCase();
    if (!this.searchable() || !query) return options;

    return options.filter((option) =>
      `${lzSelectOptionLabel(option)} ${lzSelectOptionDate(option) ?? ''}`
        .trim()
        .toLowerCase()
        .includes(query),
    );
  });
  protected readonly showNoResults = computed(
    () => this.searchable() && !!this.searchQuery().trim() && this.filteredOptions().length === 0,
  );

  readonly selectId = `lz-select-${nextSelectFieldId++}`;
  readonly listboxId = `${this.selectId}-listbox`;
  readonly labelId = `${this.selectId}-label`;
  protected readonly valueId = `${this.selectId}-value`;
  protected readonly helperId = `${this.selectId}-helper`;
  readonly paneClass = 'lz-select-cdk-pane';

  @ViewChild('trigger', { static: true })
  private trigger?: ElementRef<HTMLButtonElement>;

  @ViewChild('dropdownTpl', { static: true })
  private dropdownTpl?: TemplateRef<unknown>;

  protected readonly isOpen = signal(false);
  /** The chosen options; at most one unless `multiple`. */
  protected readonly selection = signal<readonly LzSelectOptionType[]>([]);

  private readonly cvaDisabled = signal(false);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (value: LzSelectOptionType | LzSelectOptionType[] | null) => void = () =>
    undefined;
  private onTouched: () => void = () => undefined;

  private overlayRef?: OverlayRef;
  private portalView?: EmbeddedViewRef<unknown>;
  private floatingCleanup?: () => void;

  protected readonly displayValue = computed(() => {
    const chosen = this.selection();
    if (chosen.length === 0) return '';
    if (!this.multiple()) return lzSelectOptionLabel(chosen[0]);

    const summary = this.selectionSummary();
    return summary ? summary(chosen) : chosen.map(lzSelectOptionLabel).join(', ');
  });

  ngOnDestroy(): void {
    this.teardownOverlay();
  }

  /** Takes an option, an array of options (`multiple`), or null for none. */
  writeValue(value: LzSelectOptionType | readonly LzSelectOptionType[] | null): void {
    if (value == null) {
      this.selection.set([]);
    } else if (Array.isArray(value)) {
      this.selection.set([...value]);
    } else {
      this.selection.set([value as LzSelectOptionType]);
    }
  }

  registerOnChange(fn: (value: LzSelectOptionType | LzSelectOptionType[] | null) => void): void {
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
    if (this.multiple()) {
      const chosen = this.selection();
      const next = this.isSelected(option)
        ? chosen.filter((item) => !sameOption(item, option))
        : [...chosen, option];
      this.selection.set(next);
      this.onChange([...next]);
      return;
    }

    this.selection.set([option]);
    this.closeDropdown();
    this.onChange(option);
    this.onTouched();
  }

  protected onOptionKeydown(event: Event, option: LzSelectOptionType): void {
    const key = (event as KeyboardEvent).key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.selectOption(option);
      return;
    }
    this.onListKeydown(event as KeyboardEvent);
  }

  /** ArrowDown from the search box enters the list; Tab leaves the popup. */
  protected onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.optionElements()[0]?.focus();
      return;
    }
    if (event.key === 'Tab') {
      this.closeDropdown();
    }
  }

  /** Keys every option shares: arrows, Home and End move; Tab leaves the popup. */
  private onListKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      // Focus goes back to the trigger first, so Tab carries on from there
      // rather than from the overlay at the end of the document.
      this.closeDropdown();
      return;
    }

    const items = this.optionElements();
    const index = items.indexOf(event.target as HTMLElement);
    if (index === -1) return;

    let next: HTMLElement | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = items[(index + 1) % items.length];
        break;
      case 'ArrowUp':
        next = index === 0 ? (this.searchInput() ?? items[items.length - 1]) : items[index - 1];
        break;
      case 'Home':
        next = items[0];
        break;
      case 'End':
        next = items[items.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
  }

  protected getOptionTitle(option: LzSelectOptionType): string {
    return lzSelectOptionLabel(option);
  }

  protected getOptionDate(option: LzSelectOptionType): string | null {
    return lzSelectOptionDate(option);
  }

  /** Keeps an option's row when the app hands over rebuilt option objects. */
  protected optionKey(option: LzSelectOptionType): unknown {
    return typeof option === 'string' ? option : (option.id ?? option.value ?? option);
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
    return this.selection().some((item) => sameOption(item, option));
  }

  /**
   * Claims the key with `preventDefault` so an enclosing `lz-modal`, which
   * listens further up on `window`, leaves this Escape to the list.
   */
  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event?: Event): void {
    if (this.isOpen()) {
      event?.preventDefault();
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

    this.searchQuery.set('');
    this.isOpen.set(true);
    this.attachOverlay();
    this.opened.emit();
    // The list lives in an overlay at the end of the document, out of the tab
    // order, so the keyboard can only reach it if focus is moved there. The list
    // is rendered now rather than on the next pass so there is something to focus.
    this.portalView?.detectChanges();
    this.focusInitial();
  }

  /**
   * Closes the list. Focus inside it goes back to the trigger: the overlay is
   * about to be detached, which would otherwise drop focus on the body.
   */
  private closeDropdown(): void {
    const wasOpen = this.isOpen();
    const pane = this.overlayRef?.overlayElement;
    const focusInside = !!pane && pane.contains(document.activeElement);

    this.isOpen.set(false);
    this.searchQuery.set('');
    this.detachOverlay();

    if (focusInside) {
      this.trigger?.nativeElement.focus();
    }
    if (wasOpen) {
      this.onTouched();
    }
  }

  /** Focus left the field without the list being open: the user has been through it. */
  protected onTriggerBlur(): void {
    if (!this.isOpen()) this.onTouched();
  }

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement | null)?.value ?? '');
  }

  /** The search box when there is one, else the (first) chosen option, else the first. */
  private focusInitial(): void {
    if (!this.isOpen()) return;
    const items = this.optionElements();
    const target =
      this.searchInput() ??
      items.find((item) => item.getAttribute('aria-selected') === 'true') ??
      items[0];
    target?.focus({ preventScroll: true });
  }

  private optionElements(): HTMLElement[] {
    const pane = this.overlayRef?.overlayElement;
    return pane ? Array.from(pane.querySelectorAll<HTMLElement>('.lz-select-option')) : [];
  }

  private searchInput(): HTMLInputElement | null {
    return this.overlayRef?.overlayElement.querySelector('.lz-select-search-input') ?? null;
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
      this.portalView = this.overlayRef.attach(new TemplatePortal(tpl, this.vcr));
    }

    this.startFloating();
  }

  private detachOverlay(): void {
    this.stopFloating();
    this.overlayRef?.detach();
    this.portalView = undefined;
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

    this.floatingCleanup = attachLzFloating(reference, floating, {
      placement: 'bottom-start',
      offset: DROPDOWN_OFFSET_PX,
      shiftPadding: DROPDOWN_VIEWPORT_PADDING_PX,
      flipPadding: DROPDOWN_VIEWPORT_PADDING_PX,
      strategy: 'fixed',
      round: false,
      matchWidth: true,
      maxHeight: DROPDOWN_MAX_HEIGHT_PX,
      sizePadding: DROPDOWN_VIEWPORT_PADDING_PX,
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }
}
