import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon.component';
import { LzIconName } from '../icon/icon.types';

/**
 * One entry of a side navigation menu (Figma "Menu Navigation/Base Item").
 *
 * An attribute component on the element that does the navigating, so a router
 * link stays a real link: `<a lz-nav-item routerLink="/campaigns">Campaigns</a>`.
 * The label is the projected content.
 *
 * The current entry is marked either by `active` or by `aria-current="page"`,
 * which Angular's `routerLinkActive` sets through `ariaCurrentWhenActive`. Both
 * draw the same way, so a router-driven menu needs no extra binding.
 */
@Component({
  // An attribute selector on purpose (as Material's a[mat-button]): wrapping the
  // link in an lz-nav-item element would cut routerLink and middle-click off it.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[lz-nav-item], button[lz-nav-item]',
  standalone: true,
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-nav-item',
    '[attr.data-active]': "active() ? 'true' : null",
  },
  template: `
    @if (icon(); as name) {
      <lz-icon class="lz-nav-item__icon" [name]="name" type="outline" />
    }
    <span class="lz-nav-item__label"><ng-content /></span>
  `,
  styleUrl: './nav-item.component.scss',
})
export class NavItem {
  /** Heroicons outline name drawn before the label. */
  readonly icon = input<LzIconName | undefined>(undefined);
  /** Draws the entry as the current one, for menus not driven by the router. */
  readonly active = input(false, { transform: booleanAttribute });
}
