import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { map } from 'rxjs';
import { AlertPage } from './alert-page';
import { ArticlecardReactionsPage } from './articlecard-reactions-page';
import { AuthFooterPage } from './auth-footer-page';
import { AvatarGroupPage } from './avatar-group-page';
import { AvatarPage } from './avatar-page';
import { BadgePage } from './badge-page';
import { ButtonGroupPage } from './button-group-page';
import { ButtonPage } from './button-page';
import { CardPage } from './card-page';
import { CheckboxPage } from './checkbox-page';
import { DropdownPage } from './dropdown-page';
import { IconPage } from './icon-page';
import { InputPage } from './input-page';
import { LanguageDropdownPage } from './language-dropdown-page';
import { LiveEventCardPage } from './live-event-card-page';
import { LoadingPage } from './loading-page';
import { LoginPromptBannerPage } from './login-prompt-banner-page';
import { MoreActionsMenuPage } from './more-actions-menu-page';
import { ProgressCirclePage } from './progress-circle-page';
import { PulseDotPage } from './pulse-dot-page';
import { SelectPage } from './select-page';
import { StubPage } from './stub-page';
import { SwitchTogglePage } from './switch-toggle-page';
import { SwiperPage } from './swiper-page';
import { TabButtonPage } from './tab-button-page';
import { TablePage } from './table-page';
import { TabsPage } from './tabs-page';
import { TextareaPage } from './textarea-page';
import { ToastPage } from './toast-page';
import { TooltipPage } from './tooltip-page';
import { VideoPlayerPage } from './video-player-page';

/**
 * Resolves `/components/:name` to a concrete demo page.
 */
@Component({
  selector: 'docs-component-host',
  standalone: true,
  imports: [
    TranslocoPipe,
    AlertPage,
    ArticlecardReactionsPage,
    AuthFooterPage,
    AvatarGroupPage,
    AvatarPage,
    BadgePage,
    ButtonGroupPage,
    ButtonPage,
    CardPage,
    CheckboxPage,
    DropdownPage,
    IconPage,
    InputPage,
    LanguageDropdownPage,
    LiveEventCardPage,
    LoadingPage,
    LoginPromptBannerPage,
    MoreActionsMenuPage,
    ProgressCirclePage,
    PulseDotPage,
    SelectPage,
    StubPage,
    SwitchTogglePage,
    SwiperPage,
    TabButtonPage,
    TablePage,
    TabsPage,
    TextareaPage,
    ToastPage,
    TooltipPage,
    VideoPlayerPage,
  ],
  template: `
    @switch (name()) {
      @case ('alert') {
        <docs-alert-page />
      }
      @case ('articlecard-reactions') {
        <docs-articlecard-reactions-page />
      }
      @case ('auth-footer') {
        <docs-auth-footer-page />
      }
      @case ('avatar') {
        <docs-avatar-page />
      }
      @case ('avatar-group') {
        <docs-avatar-group-page />
      }
      @case ('badge') {
        <docs-badge-page />
      }
      @case ('button') {
        <docs-button-page />
      }
      @case ('button-group') {
        <docs-button-group-page />
      }
      @case ('card') {
        <docs-card-page />
      }
      @case ('checkbox') {
        <docs-checkbox-page />
      }
      @case ('dropdown') {
        <docs-dropdown-page />
      }
      @case ('icon') {
        <docs-icon-page />
      }
      @case ('input') {
        <docs-input-page />
      }
      @case ('language-dropdown') {
        <docs-language-dropdown-page />
      }
      @case ('live-event-card') {
        <docs-live-event-card-page />
      }
      @case ('loading') {
        <docs-loading-page />
      }
      @case ('login-prompt-banner') {
        <docs-login-prompt-banner-page />
      }
      @case ('more-actions-menu') {
        <docs-more-actions-menu-page />
      }
      @case ('progress-circle') {
        <docs-progress-circle-page />
      }
      @case ('pulse-dot') {
        <docs-pulse-dot-page />
      }
      @case ('select') {
        <docs-select-page />
      }
      @case ('stub') {
        <docs-stub-page />
      }
      @case ('switch-toggle') {
        <docs-switch-toggle-page />
      }
      @case ('swiper') {
        <docs-swiper-page />
      }
      @case ('tab-button') {
        <docs-tab-button-page />
      }
      @case ('table') {
        <docs-table-page />
      }
      @case ('tabs') {
        <docs-tabs-page />
      }
      @case ('textarea') {
        <docs-textarea-page />
      }
      @case ('toast') {
        <docs-toast-page />
      }
      @case ('tooltip') {
        <docs-tooltip-page />
      }
      @case ('video-player') {
        <docs-video-player-page />
      }
      @default {
        <p class="missing">{{ 'componentHost.missing' | transloco: { name: name() } }}</p>
      }
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
}
