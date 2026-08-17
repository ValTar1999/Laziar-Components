import { Component, computed, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon.component';

/**
 * Login prompt banner for `@laziar/components`.
 * Ported from frontend `app-login-prompt-banner`.
 */
@Component({
  selector: 'lz-login-prompt-banner',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [RouterLink, Icon],
  templateUrl: './login-prompt-banner.component.html',
  styleUrl: './login-prompt-banner.component.scss',
  host: {
    class: 'lz-login-prompt-banner-host',
  },
})
export class LoginPromptBanner {
  readonly text = input('');
  readonly route = input('/auth');
  readonly ariaLabel = input('');

  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() || this.text());
}
