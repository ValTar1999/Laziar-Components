import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCS_NAV, filterDocsNav } from './core/docs-nav';
import { DocsHeader } from './layout/docs-header/docs-header';
import { DocsSidebar } from './layout/docs-sidebar/docs-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DocsHeader, DocsSidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly searchQuery = signal('');

  protected readonly navGroups = computed(() => filterDocsNav(this.searchQuery(), DOCS_NAV));

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
