import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
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
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { attachLzFloating } from '../floating/floating';
import { Icon } from '../icon/icon.component';
import {
  LzDropdownEntry,
  LzDropdownItemTone,
  LzDropdownPlacement,
  LzDropdownSection,
  LzDropdownSize,
} from './dropdown.types';

let nextDropdownId = 0;

/**
 * Marks content to draw as the dropdown's trigger instead of its title and
 * chevron, such as an avatar opening a profile menu:
 * `<lz-dropdown ariaLabel="Account"><lz-avatar lzDropdownTrigger … /></lz-dropdown>`.
 * The content sits inside the trigger button, so it must not be interactive
 * itself; the button keeps the keyboard, the ARIA state and the focus ring.
 * Give the dropdown an `ariaLabel`: the content is usually not a name.
 */
@Directive({ selector: '[lzDropdownTrigger]', standalone: true })
export class LzDropdownTrigger {}

/** An entry with every optional field resolved, as the template renders it. */
interface ResolvedDropdownItem {
  label: string;
  value: string;
  icon: string | undefined;
  tone: LzDropdownItemTone;
  disabled: boolean;
  /** `null` for a plain action, a boolean for a pick-one choice. */
  selected: boolean | null;
}

interface ResolvedDropdownSection {
  heading: string;
  items: ResolvedDropdownItem[];
}

function resolveEntry(entry: LzDropdownEntry): ResolvedDropdownItem {
  if (typeof entry === 'string') {
    return {
      label: entry,
      value: entry,
      icon: undefined,
      tone: 'default',
      disabled: false,
      selected: null,
    };
  }
  return {
    label: entry.label,
    value: entry.value ?? entry.label,
    icon: entry.icon || undefined,
    tone: entry.tone ?? 'default',
    disabled: !!entry.disabled,
    selected: entry.selected === undefined ? null : entry.selected,
  };
}

const DROPDOWN_OFFSET_PX = 8;
const DROPDOWN_VIEWPORT_PADDING_PX = 8;
const DROPDOWN_MAX_HEIGHT_PX = 280;

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
 * Menu dropdown `@laziar/components`.
 * Trigger + sectioned menu. Overlay via CDK + Floating UI.
 * Styles — Laziar System (Figma Dropdown / Select Menu).
 */
@Component({
  selector: 'lz-dropdown',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayModule, Icon],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  host: {
    class: 'lz-dropdown-host',
    '[class.lz-dropdown-host--full]': 'fullWidth()',
  },
})
export class DropdownComponent implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  readonly title = input('Menu');
  readonly sections = input<LzDropdownSection[]>([]);
  readonly sizeVariant = input<LzDropdownSize>('xl');
  readonly disabled = input(false, { transform: booleanAttribute });
  /**
   * Leading icon in the trigger. With an empty `title` the trigger becomes
   * icon-only (no chevron), e.g. a "⋮" row-actions button; give it `ariaLabel`.
   */
  readonly icon = input<string | undefined>(undefined);
  /** Accessible name of the trigger. Required when the trigger is icon-only. */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Where the menu opens relative to the trigger. */
  readonly placement = input<LzDropdownPlacement>('bottom-start');
  /** Stretch the trigger to the host's full width (sidebar switchers). */
  readonly fullWidth = input(false, { transform: booleanAttribute });

  /** Emits the selected item's `value` (or its label, for a plain string item). */
  readonly itemSelected = output<string>();
  readonly opened = output<void>();
  // Required source-compatible API name.
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly close = output<void>();

  readonly dropdownId = `lz-dropdown-${nextDropdownId++}`;
  readonly menuId = `${this.dropdownId}-menu`;
  readonly paneClass = 'lz-dropdown-cdk-pane';

  @ViewChild('trigger', { static: true })
  private trigger?: ElementRef<HTMLButtonElement>;

  @ViewChild('menuTpl', { static: true })
  private menuTpl?: TemplateRef<unknown>;

  protected readonly isOpen = signal(false);

  /** Content projected as the trigger, which replaces the title and chevron. */
  private readonly customTrigger = contentChild(LzDropdownTrigger);
  protected readonly hasCustomTrigger = computed(() => !!this.customTrigger());

  /** Sections with every entry resolved to a full item. */
  protected readonly resolvedSections = computed<ResolvedDropdownSection[]>(() =>
    this.sections().map((section) => ({
      heading: section.heading,
      items: section.items.map(resolveEntry),
    })),
  );

  /** An icon with no title renders an icon-only trigger without a chevron. */
  protected readonly isIconOnly = computed(() => !!this.icon() && !this.title().trim());

  private overlayRef?: OverlayRef;
  private floatingCleanup?: () => void;

  ngOnDestroy(): void {
    this.teardownOverlay();
  }

  protected toggleDropdown(): void {
    if (this.disabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  protected selectItem(item: ResolvedDropdownItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item.value);
    this.closeDropdown();
  }

  protected onItemKeydown(event: Event, item: ResolvedDropdownItem): void {
    const key = (event as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;
    event.preventDefault();
    this.selectItem(item);
  }

  /**
   * Menu keyboard model (WAI-ARIA menu pattern): ArrowDown / ArrowUp move
   * between enabled items and wrap, Home / End jump to the first / last one.
   * Tab is left alone, so it leaves the menu as usual.
   */
  protected onMenuKeydown(event: KeyboardEvent): void {
    const items = this.enabledItems();
    if (!items.length) return;

    const current = items.indexOf(document.activeElement as HTMLElement);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = current < 0 || current === items.length - 1 ? 0 : current + 1;
        break;
      case 'ArrowUp':
        next = current <= 0 ? items.length - 1 : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    items[next].focus();
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
  protected onClickOutside(event: Event): void {
    if (!this.isOpen()) return;

    const target = event.target as Node | null;
    if (!target) return;
    if (this.elementRef.nativeElement.contains(target)) return;
    if (this.overlayRef?.overlayElement.contains(target)) return;

    this.closeDropdown();
  }

  private openDropdown(): void {
    if (this.isOpen() || this.disabled()) return;

    this.isOpen.set(true);
    this.attachOverlay();
    this.opened.emit();
  }

  /**
   * Closes the menu. When focus was inside it (keyboard use, or a click on an
   * item), focus goes back to the trigger: the menu lives in the overlay
   * container at the end of the document, so otherwise focus would drop to
   * <body> and the next Tab would restart from the top of the page. An outside
   * click leaves focus where the user put it.
   */
  private closeDropdown(): void {
    if (!this.isOpen()) return;

    const menuHadFocus = !!this.overlayRef?.overlayElement.contains(document.activeElement);
    this.isOpen.set(false);
    this.detachOverlay();
    if (menuHadFocus) {
      this.trigger?.nativeElement.focus();
    }
    this.close.emit();
  }

  private enabledItems(): HTMLElement[] {
    return Array.from(
      this.overlayRef?.overlayElement.querySelectorAll<HTMLElement>(
        '.lz-dropdown__item:not(:disabled)',
      ) ?? [],
    );
  }

  private attachOverlay(): void {
    const tpl = this.menuTpl;
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
    queueMicrotask(() => this.focusFirstItem());
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

  private focusFirstItem(): void {
    this.enabledItems()[0]?.focus();
  }

  private startFloating(): void {
    this.stopFloating();

    const reference = this.trigger?.nativeElement;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) return;

    this.floatingCleanup = attachLzFloating(reference, floating, {
      placement: this.placement(),
      offset: DROPDOWN_OFFSET_PX,
      shiftPadding: DROPDOWN_VIEWPORT_PADDING_PX,
      flipPadding: DROPDOWN_VIEWPORT_PADDING_PX,
      strategy: 'fixed',
      round: false,
      minWidth: true,
      maxHeight: DROPDOWN_MAX_HEIGHT_PX,
      sizePadding: DROPDOWN_VIEWPORT_PADDING_PX,
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }
}
