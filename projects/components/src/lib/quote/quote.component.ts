import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { LzQuoteAuthor } from './quote.types';

/**
 * Article pull-quote with optional author and caption.
 * Ported from frontend `app-block-quote` without `ArticleRenderBlock`.
 */
@Component({
  selector: 'lz-quote',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-quote-host',
  },
})
export class Quote {
  /** Quote body. CMS HTML, same as frontend `block.blockContent`. */
  readonly content = input('');
  readonly author = input<LzQuoteAuthor | null>(null);
  /** Caption under the author, same as frontend `quoteSubtext`. */
  readonly subtext = input('');

  protected readonly showAuthor = computed(() => {
    const author = this.author();
    return Boolean(author?.fullName || author?.position);
  });

  protected readonly showFooter = computed(() => this.showAuthor() || Boolean(this.subtext()));
}
