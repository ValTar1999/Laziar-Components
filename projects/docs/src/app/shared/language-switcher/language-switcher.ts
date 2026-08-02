import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Button, ButtonGroup } from '@laziar/components';
import { DocsLang, DOCS_LANGS, isDocsLang, persistLang } from '../../core/i18n';

@Component({
  selector: 'docs-language-switcher',
  standalone: true,
  imports: [Button, ButtonGroup, TranslocoPipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);

  protected readonly langs = DOCS_LANGS;
  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected setLang(lang: DocsLang): void {
    if (!isDocsLang(lang)) {
      return;
    }

    this.transloco.setActiveLang(lang);
    persistLang(lang);
  }

  protected variant(lang: DocsLang): 'secondary' | 'tertiary' {
    return this.activeLang() === lang ? 'secondary' : 'tertiary';
  }

  protected label(lang: DocsLang): string {
    return lang.toUpperCase();
  }
}
