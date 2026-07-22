import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DocsNavGroup } from '../../core/docs-nav';

@Component({
  selector: 'docs-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './docs-sidebar.html',
  styleUrl: './docs-sidebar.scss',
})
export class DocsSidebar {
  readonly groups = input.required<DocsNavGroup[]>();
}
