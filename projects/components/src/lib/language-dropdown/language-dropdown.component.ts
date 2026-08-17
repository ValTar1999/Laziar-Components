import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
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

/**
 * Language dropdown `@laziar/components`.
 * API/стили — эталон publikator (`LanguageDropdownComponent`).
 */
@Component({
  selector: 'lz-language-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './language-dropdown.component.html',
  styleUrl: './language-dropdown.component.scss',
  host: {
    class: 'lz-language-dropdown-host',
  },
})
export class LanguageDropdown implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Available languages. Pass `flag` URLs from the host app. */
  readonly languages = input<LzLanguageOption[]>(DEFAULT_LANGUAGES);
  /** localStorage key for the selected language code. */
  readonly storageKey = input('appLanguage');

  readonly languageChange = output<LzLanguageOption>();

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

  protected toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update((open) => !open);
  }

  protected selectLanguage(lang: LzLanguageOption): void {
    this.selectedCode.set(lang.code);
    this.persist(lang.code);
    this.isOpen.set(false);
    this.languageChange.emit(lang);
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

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
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
