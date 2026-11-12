import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

/**
 * Top of a publikator page: title (+ optional subtitle), actions on the right,
 * optional tabs underneath, and one full-width line under it all.
 *
 * Project actions with `[lzPageHeaderActions]`, tabs with `[lzPageHeaderTabs]`, and
 * anything that belongs beside the title (a count, a status) with `[lzPageHeaderTitleAddon]`:
 *
 * ```html
 * <lz-page-header heading="Conținut Video">
 *   <lz-button lzPageHeaderActions label="Creează" size="sm" pill />
 *   <lz-tabs lzPageHeaderTabs [tabs]="tabs" [style]="'underline'" />
 * </lz-page-header>
 * ```
 */
@Component({
  selector: 'lz-page-header',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-page-header-host',
  },
})
export class PageHeader {
  /**
   * Page title, rendered as the page's `<h1>`. Not called `title`: a static
   * `title="…"` would also land on the host as a native tooltip.
   */
  readonly heading = input('');
  /** Optional line under the title. */
  readonly subtitle = input('');
}
