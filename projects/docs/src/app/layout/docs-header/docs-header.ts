import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button, ButtonGroup, InputComponent, LzThemeMode, ThemeService } from '@laziar/components';
import { DOCS_REPO_URL } from '../../core/docs-nav';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher';

@Component({
  selector: 'docs-header',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    Button,
    ButtonGroup,
    InputComponent,
    TranslocoPipe,
    LanguageSwitcherComponent,
  ],
  templateUrl: './docs-header.html',
  styleUrl: './docs-header.scss',
})
export class DocsHeader {
  readonly mobileNavOpen = input(false);
  readonly menuToggle = output<void>();
  readonly searchChange = output<string>();

  private readonly theme = inject(ThemeService);

  protected readonly repoUrl = DOCS_REPO_URL;
  protected readonly mode = this.theme.mode;
  protected search = '';

  protected onSearch(value: string): void {
    this.search = value;
    this.searchChange.emit(value);
  }

  protected setTheme(mode: LzThemeMode): void {
    this.theme.setMode(mode);
  }

  protected openRepo(): void {
    window.open(this.repoUrl, '_blank', 'noopener,noreferrer');
  }

  protected themeVariant(mode: LzThemeMode): 'secondary' | 'tertiary' {
    return this.mode() === mode ? 'secondary' : 'tertiary';
  }

  protected menuIcon(): string {
    return this.mobileNavOpen() ? 'x-mark' : 'bars-3';
  }

  protected menuLabelKey(): string {
    return this.mobileNavOpen() ? 'nav.closeMenu' : 'nav.openMenu';
  }
}
