import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Prefer a structured Transloco key; fall back to the original string
 * (and still try translating that string if it itself is a key).
 */
@Pipe({ name: 'docsT', standalone: true, pure: false })
export class DocsTranslatePipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  transform(fallback: string | undefined | null, key?: string | null): string {
    if (key) {
      const fromKey = this.transloco.translate(key);
      if (fromKey !== key) {
        return fromKey;
      }
    }

    if (!fallback) {
      return '';
    }

    const fromFallback = this.transloco.translate(fallback);
    return fromFallback !== fallback ? fromFallback : fallback;
  }
}
