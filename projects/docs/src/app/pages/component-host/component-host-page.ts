import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { StubPage } from './stub-page';

/**
 * Resolves `/components/:name` to a concrete demo page.
 * Only `stub` is registered for now.
 */
@Component({
  selector: 'docs-component-host',
  standalone: true,
  imports: [StubPage],
  template: `
    @switch (name()) {
      @case ('stub') {
        <docs-stub-page />
      }
      @default {
        <p class="missing">Компонент «{{ name() }}» ещё не задокументирован.</p>
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
