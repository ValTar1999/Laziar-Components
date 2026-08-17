import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
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
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { Icon } from '../icon/icon.component';
import { LzDropdownSection, LzDropdownSize } from './dropdown.types';

let nextDropdownId = 0;

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

  protected selectItem(item: string): void {
    this.itemSelected.emit(item);
    this.closeDropdown();
  }

  protected onItemKeydown(event: Event, item: string): void {
    const key = (event as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;
    event.preventDefault();
    this.selectItem(item);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
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

  private closeDropdown(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.detachOverlay();
    this.close.emit();
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
    this.overlayRef?.overlayElement.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }

  private startFloating(): void {
    this.stopFloating();

    const reference = this.trigger?.nativeElement;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) return;

    this.floatingCleanup = autoUpdate(reference, floating, () => {
      void this.positionMenu(reference, floating);
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }

  private async positionMenu(reference: HTMLElement, floating: HTMLElement): Promise<void> {
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
              minWidth: `${rects.reference.width}px`,
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
