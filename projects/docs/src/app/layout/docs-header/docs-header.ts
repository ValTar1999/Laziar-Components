import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LzThemeMode, ThemeService } from '@laziar/components';
import { DOCS_REPO_URL } from '../../core/docs-nav';

@Component({
  selector: 'docs-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './docs-header.html',
  styleUrl: './docs-header.scss',
})
export class DocsHeader {
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
}
