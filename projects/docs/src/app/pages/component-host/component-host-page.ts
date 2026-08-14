import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { map } from 'rxjs';
import { AlertPage } from './alert-page';
import { AvatarGroupPage } from './avatar-group-page';
import { AvatarPage } from './avatar-page';
import { BadgePage } from './badge-page';
import { ButtonGroupPage } from './button-group-page';
import { ButtonPage } from './button-page';
import { CheckboxPage } from './checkbox-page';
import { IconPage } from './icon-page';
import { InputPage } from './input-page';
import { LoadingPage } from './loading-page';
import { ProgressCirclePage } from './progress-circle-page';
import { PulseDotPage } from './pulse-dot-page';
import { DropdownPage } from './dropdown-page';
import { SelectPage } from './select-page';
import { StubPage } from './stub-page';
import { SwitchTogglePage } from './switch-toggle-page';
import { TabButtonPage } from './tab-button-page';
import { TabsPage } from './tabs-page';
import { TextareaPage } from './textarea-page';
import { TooltipPage } from './tooltip-page';

/**
 * Resolves `/components/:name` to a concrete demo page.
 */
@Component({
  selector: 'docs-component-host',
  standalone: true,
  imports: [
    TranslocoPipe,
    AlertPage,
    AvatarGroupPage,
    AvatarPage,
    BadgePage,
    ButtonGroupPage,
    ButtonPage,
    CheckboxPage,
    IconPage,
    InputPage,
    LoadingPage,
    ProgressCirclePage,
    PulseDotPage,
    DropdownPage,
    SelectPage,
    StubPage,
    SwitchTogglePage,
    TabButtonPage,
    TabsPage,
    TextareaPage,
    TooltipPage,
  ],
  template: `
    @switch (name()) {
      @case ('alert') {
        <docs-alert-page />
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
      @case ('checkbox') {
        <docs-checkbox-page />
      }
      @case ('icon') {
        <docs-icon-page />
      }
      @case ('input') {
        <docs-input-page />
      }
      @case ('loading') {
        <docs-loading-page />
      }
      @case ('progress-circle') {
        <docs-progress-circle-page />
      }
      @case ('pulse-dot') {
        <docs-pulse-dot-page />
      }
      @case ('dropdown') {
        <docs-dropdown-page />
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
      @case ('tab-button') {
        <docs-tab-button-page />
      }
      @case ('tabs') {
        <docs-tabs-page />
      }
      @case ('textarea') {
        <docs-textarea-page />
      }
      @case ('tooltip') {
        <docs-tooltip-page />
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
