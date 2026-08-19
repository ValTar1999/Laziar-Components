import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { Icon } from '../icon/icon.component';
import { LzLanguageOption } from './language-dropdown.types';

const DEFAULT_LANGUAGES: LzLanguageOption[] = [
  { code: 'ro', name: 'Română', flag: '', initials: 'RO' },
  { code: 'ru', name: 'Русский', flag: '', initials: 'РУ' },
  { code: 'en', name: 'English', flag: '', initials: 'EN' },
  { code: 'de', name: 'Deutsch', flag: '', initials: 'DE' },
  { code: 'fr', name: 'Français', flag: '', initials: 'FR' },
  { code: 'it', name: 'Italiano', flag: '', initials: 'IT' },
];

let nextLanguageDropdownId = 0;

const MENU_OFFSET_PX = 8;
const MENU_VIEWPORT_PADDING_PX = 8;
const MENU_WIDTH_PX = 160;
const MENU_MAX_HEIGHT_PX = 280;

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
 * Language dropdown `@laziar/components`.
 * API/стили — эталон publikator (`LanguageDropdownComponent`).
 * Overlay via CDK + Floating UI (same pattern as `lz-dropdown`).
 */
@Component({
  selector: 'lz-language-dropdown',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, OverlayModule],
  templateUrl: './language-dropdown.component.html',
  styleUrl: './language-dropdown.component.scss',
  host: {
    class: 'lz-language-dropdown-host',
  },
})
export class LanguageDropdown implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  /** Available languages. Pass `flag` URLs from the host app. */
  readonly languages = input<LzLanguageOption[]>(DEFAULT_LANGUAGES);
  /** localStorage key for the selected language code. */
  readonly storageKey = input('appLanguage');

  readonly languageChange = output<LzLanguageOption>();

  readonly dropdownId = `lz-language-dropdown-${nextLanguageDropdownId++}`;
  readonly menuId = `${this.dropdownId}-menu`;
  readonly paneClass = 'lz-language-dropdown-cdk-pane';

  @ViewChild('trigger', { static: true })
  private trigger?: ElementRef<HTMLButtonElement>;

  @ViewChild('menuTpl', { static: true })
  private menuTpl?: TemplateRef<unknown>;

  protected readonly isOpen = signal(false);
  protected readonly selectedCode = signal('ro');

  protected readonly selectedLanguage = computed((): LzLanguageOption | null => {
    const list = this.languages();
    if (!list.length) {
      return null;
    }
    const code = this.selectedCode();
    return list.find((l) => l.code === code) ?? list[0];
  });

  private overlayRef?: OverlayRef;
  private floatingCleanup?: () => void;

  ngOnInit(): void {
    const list = this.languages();
    if (!list.length) {
      return;
    }

    const saved = this.readStoredCode();
    const match = (saved && list.find((l) => l.code === saved)) || list[0];
    this.selectedCode.set(match.code);
    this.persist(match.code);
  }

  ngOnDestroy(): void {
    this.teardownOverlay();
  }

  protected toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isOpen()) {
      this.closeDropdown();
      return;
    }
    this.openDropdown();
  }

  protected selectLanguage(lang: LzLanguageOption): void {
    this.selectedCode.set(lang.code);
    this.persist(lang.code);
    this.languageChange.emit(lang);
    this.closeDropdown();
  }

  protected onLanguageKeydown(event: Event, lang: LzLanguageOption): void {
    const key = (event as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;
    event.preventDefault();
    this.selectLanguage(lang);
  }

  protected isCurrentLanguage(code: string): boolean {
    return code === this.selectedCode();
  }

  protected getInitials(lang: LzLanguageOption | null): string {
    if (!lang) {
      return '';
    }
    return lang.initials?.trim() || lang.code.toUpperCase();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.closeDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (!target) {
      return;
    }
    if (this.elementRef.nativeElement.contains(target)) {
      return;
    }
    if (this.overlayRef?.overlayElement.contains(target)) {
      return;
    }
    this.closeDropdown();
  }

  private openDropdown(): void {
    if (this.isOpen()) {
      return;
    }
    this.isOpen.set(true);
    this.attachOverlay();
  }

  private closeDropdown(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    this.detachOverlay();
  }

  private attachOverlay(): void {
    const tpl = this.menuTpl;
    if (!tpl) {
      return;
    }

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
    queueMicrotask(() => this.focusActiveItem());
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

  private focusActiveItem(): void {
    const root = this.overlayRef?.overlayElement;
    const active = root?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
    (active ?? root?.querySelector<HTMLElement>('[role="option"]'))?.focus();
  }

  private startFloating(): void {
    this.stopFloating();

    const reference = this.trigger?.nativeElement;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) {
      return;
    }

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
        offset(MENU_OFFSET_PX),
        flip({ padding: MENU_VIEWPORT_PADDING_PX }),
        shift({ padding: MENU_VIEWPORT_PADDING_PX }),
        size({
          padding: MENU_VIEWPORT_PADDING_PX,
          apply({ rects, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              minWidth: `${Math.max(MENU_WIDTH_PX, rects.reference.width)}px`,
              maxHeight: `${Math.min(MENU_MAX_HEIGHT_PX, Math.max(0, availableHeight))}px`,
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

  private readStoredCode(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      return localStorage.getItem(this.storageKey());
    } catch {
      return null;
    }
  }

  private persist(code: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      localStorage.setItem(this.storageKey(), code);
    } catch {
      // private mode / blocked storage
    }
  }
}
