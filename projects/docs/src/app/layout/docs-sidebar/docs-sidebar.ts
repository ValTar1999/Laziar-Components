import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Button, Icon, Tooltip } from '@laziar/components';
import { DocsNavGroup } from '../../core/docs-nav';

@Component({
  selector: 'docs-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Button, Icon, Tooltip, TranslocoPipe],
  templateUrl: './docs-sidebar.html',
  styleUrl: './docs-sidebar.scss',
})
export class DocsSidebar {
  private readonly transloco = inject(TranslocoService);

  readonly groups = input.required<DocsNavGroup[]>();
  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();
  readonly closeMobile = output<void>();

  protected toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed());
  }

  protected collapseLabel(): string {
    return this.transloco.translate(this.collapsed() ? 'nav.expandMenu' : 'nav.collapseMenu');
  }

  protected onNavigate(): void {
    this.closeMobile.emit();
  }
}
