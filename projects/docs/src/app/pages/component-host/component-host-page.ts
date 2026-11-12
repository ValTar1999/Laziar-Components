import { NgComponentOutlet } from '@angular/common';
import { Component, effect, inject, signal, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { map } from 'rxjs';

/**
 * Route name to its demo page. Each page is loaded on demand, so opening one
 * component does not download the demos of all the others.
 *
 * To add a page: add a line here and an entry in `docs-nav.ts`.
 */
const PAGES: Record<string, () => Promise<Type<unknown>>> = {
  alert: () => import('./alert-page').then((m) => m.AlertPage),
  'articlecard-reactions': () =>
    import('./articlecard-reactions-page').then((m) => m.ArticlecardReactionsPage),
  'auth-footer': () => import('./auth-footer-page').then((m) => m.AuthFooterPage),
  avatar: () => import('./avatar-page').then((m) => m.AvatarPage),
  'avatar-group': () => import('./avatar-group-page').then((m) => m.AvatarGroupPage),
  badge: () => import('./badge-page').then((m) => m.BadgePage),
  button: () => import('./button-page').then((m) => m.ButtonPage),
  'button-group': () => import('./button-group-page').then((m) => m.ButtonGroupPage),
  calendar: () => import('./calendar-page').then((m) => m.CalendarPage),
  card: () => import('./card-page').then((m) => m.CardPage),
  checkbox: () => import('./checkbox-page').then((m) => m.CheckboxPage),
  'date-input': () => import('./date-input-page').then((m) => m.DateInputPage),
  dropdown: () => import('./dropdown-page').then((m) => m.DropdownPage),
  'empty-state': () => import('./empty-state-page').then((m) => m.EmptyStatePage),
  expand: () => import('./expand-page').then((m) => m.ExpandPage),
  icon: () => import('./icon-page').then((m) => m.IconPage),
  input: () => import('./input-page').then((m) => m.InputPage),
  'language-dropdown': () => import('./language-dropdown-page').then((m) => m.LanguageDropdownPage),
  'live-event-card': () => import('./live-event-card-page').then((m) => m.LiveEventCardPage),
  'load-error': () => import('./load-error-page').then((m) => m.LoadErrorPage),
  loading: () => import('./loading-page').then((m) => m.LoadingPage),
  'loading-state': () => import('./loading-state-page').then((m) => m.LoadingStatePage),
  logo: () => import('./logo-page').then((m) => m.LogoPage),
  'login-prompt-banner': () =>
    import('./login-prompt-banner-page').then((m) => m.LoginPromptBannerPage),
  modal: () => import('./modal-page').then((m) => m.ModalPage),
  'more-actions-menu': () => import('./more-actions-menu-page').then((m) => m.MoreActionsMenuPage),
  'nav-item': () => import('./nav-item-page').then((m) => m.NavItemPage),
  'note-panel': () => import('./note-panel-page').then((m) => m.NotePanelPage),
  'page-header': () => import('./page-header-page').then((m) => m.PageHeaderPage),
  pagination: () => import('./pagination-page').then((m) => m.PaginationPage),
  'progress-circle': () => import('./progress-circle-page').then((m) => m.ProgressCirclePage),
  'pulse-dot': () => import('./pulse-dot-page').then((m) => m.PulseDotPage),
  quote: () => import('./quote-page').then((m) => m.QuotePage),
  'radio-group': () => import('./radio-group-page').then((m) => m.RadioGroupPage),
  select: () => import('./select-page').then((m) => m.SelectPage),
  stub: () => import('./stub-page').then((m) => m.StubPage),
  swiper: () => import('./swiper-page').then((m) => m.SwiperPage),
  'switch-toggle': () => import('./switch-toggle-page').then((m) => m.SwitchTogglePage),
  'tab-button': () => import('./tab-button-page').then((m) => m.TabButtonPage),
  table: () => import('./table-page').then((m) => m.TablePage),
  tabs: () => import('./tabs-page').then((m) => m.TabsPage),
  textarea: () => import('./textarea-page').then((m) => m.TextareaPage),
  toast: () => import('./toast-page').then((m) => m.ToastPage),
  tooltip: () => import('./tooltip-page').then((m) => m.TooltipPage),
  'video-player': () => import('./video-player-page').then((m) => m.VideoPlayerPage),
};

/**
 * Resolves `/components/:name` to a concrete demo page.
 */
@Component({
  selector: 'docs-component-host',
  standalone: true,
  imports: [NgComponentOutlet, TranslocoPipe],
  template: `
    @if (page(); as component) {
      <ng-container *ngComponentOutlet="component" />
    } @else if (missing()) {
      <p class="missing">{{ 'componentHost.missing' | transloco: { name: name() } }}</p>
    }
  `,
  styles: `
    .missing {
      margin: 0;
      color: var(--lz-color-text-secondary);
      font-size: var(--lz-font-size-base);
    }
  `,
})
export class ComponentHostPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly name = toSignal(this.route.paramMap.pipe(map((p) => p.get('name') ?? '')), {
    initialValue: '',
  });

  protected readonly page = signal<Type<unknown> | null>(null);
  protected readonly missing = signal(false);

  constructor() {
    effect(() => {
      const name = this.name();
      const load = Object.hasOwn(PAGES, name) ? PAGES[name] : undefined;

      this.page.set(null);
      this.missing.set(!!name && !load);
      if (!load) return;

      void load().then(
        (page) => {
          // The route may have moved on while the chunk was loading.
          if (this.name() === name) this.page.set(page);
        },
        () => {
          if (this.name() === name) this.missing.set(true);
        },
      );
    });
  }
}
