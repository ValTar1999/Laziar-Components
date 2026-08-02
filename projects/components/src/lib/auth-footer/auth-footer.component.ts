import { Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Auth page footer for `@laziar/components`.
 * Ported from frontend `app-auth-footer`.
 */
@Component({
  selector: 'lz-auth-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-footer.component.html',
  styleUrl: './auth-footer.component.scss',
  host: {
    class: 'lz-auth-footer-host',
  },
})
export class AuthFooter {
  readonly companyName = input('Laziar SRL');
  readonly aboutRoute = input('/about');
  readonly termsRoute = input('/terms-and-conditions');
  readonly contactsRoute = input('/contacts');
  readonly aboutLabel = input('Despre noi');
  readonly termsLabel = input('Termeni și condiții');
  readonly contactsLabel = input('Contacte');

  protected readonly currentYear = computed(() => new Date().getFullYear());
}
