import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

/**
 * Stacked reaction emojis with optional +N more badge.
 * Ported from frontend `app-articlecard-reactions`.
 */
@Component({
  selector: 'lz-articlecard-reactions',
  standalone: true,
  hostDirectives: [LzInputFlush],
  templateUrl: './articlecard-reactions.component.html',
  styleUrl: './articlecard-reactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-articlecard-reactions-host',
  },
})
export class ArticlecardReactions {
  readonly articleMetrics = input<Record<string, unknown> | null | undefined>(undefined);

  private readonly maxVisibleEmojis = 4;
  private readonly compactBadgeThreshold = 4;

  private readonly reactionKeys = computed(() => {
    return Object.keys(this.articleMetrics() || {}).filter((el) => el !== 'undefined');
  });

  private readonly totalReactionsCount = computed(() => {
    const metrics = this.articleMetrics();
    return this.reactionKeys().reduce((total, key) => {
      const rawValue = metrics?.[key];
      const numericValue =
        typeof rawValue === 'number' && Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 1;

      return total + numericValue;
    }, 0);
  });

  protected readonly shouldShowMoreBadge = computed(() => {
    return this.totalReactionsCount() >= this.compactBadgeThreshold;
  });

  protected readonly emoji = computed(() => {
    const visibleEmojisCount = this.shouldShowMoreBadge() ? 1 : this.maxVisibleEmojis;
    const emojis = this.reactionKeys().slice(0, visibleEmojisCount);

    return emojis.length ? emojis : ['❤️'];
  });

  protected readonly moreReactionsCount = computed(() => {
    return Math.max(0, this.totalReactionsCount() - 1);
  });
}
