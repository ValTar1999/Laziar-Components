import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { LzPaginationItem, LzPaginationSize } from './pagination.types';

/** Page slots rendered around the current page before an ellipsis is used. */
const SIBLING_COUNT = 1;
/** Page slots always rendered at each end. */
const BOUNDARY_COUNT = 1;

/**
 * Pagination `@laziar/components`.
 *
 * Emits the requested page; the host owns `page` and re-feeds it, so the
 * control stays a pure function of its inputs and never disagrees with the
 * data actually loaded.
 */
@Component({
  selector: 'lz-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  host: {
    class: 'lz-pagination-host',
  },
})
export class PaginationComponent {
  /** 1-based current page. */
  readonly page = input(1, { transform: numberAttribute });
  readonly totalPages = input(1, { transform: numberAttribute });
  readonly size = input<LzPaginationSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Hide the control entirely when there is only one page. */
  readonly hideOnSinglePage = input(true, { transform: booleanAttribute });
  readonly previousLabel = input('Previous');
  readonly nextLabel = input('Next');
  readonly ariaLabel = input('Pagination');
  /** Builds each page button's accessible label — an input so it can be localized. */
  readonly pageLabel = input<(page: number) => string>((page) => `Page ${page}`);

  readonly pageChange = output<number>();

  protected readonly currentPage = computed(() => {
    const total = this.safeTotal();
    const raw = Math.trunc(this.page());
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, total);
  });

  protected readonly visible = computed(() => this.safeTotal() > 1 || !this.hideOnSinglePage());

  protected readonly hasPrevious = computed(() => this.currentPage() > 1);
  protected readonly hasNext = computed(() => this.currentPage() < this.safeTotal());

  protected readonly items = computed<LzPaginationItem[]>(() => {
    const total = this.safeTotal();
    const current = this.currentPage();

    // Enumerate rather than elide when every page fits without a gap.
    const maxWithoutGaps = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 3;
    if (total <= maxWithoutGaps) {
      return range(1, total);
    }

    // Shift the window when it hits an edge rather than letting it shrink, so
    // the control keeps a stable width instead of collapsing on page 1.
    const windowSize = SIBLING_COUNT * 2 + 1;
    const windowEnd = Math.min(total, Math.max(1, current - SIBLING_COUNT) + windowSize - 1);
    const windowStart = Math.max(1, windowEnd - windowSize + 1);

    const shown = new Set<number>([
      ...range(1, BOUNDARY_COUNT),
      ...range(windowStart, windowEnd),
      ...range(total - BOUNDARY_COUNT + 1, total),
    ]);

    const sorted = [...shown].sort((a, b) => a - b);

    return sorted.reduce<LzPaginationItem[]>((slots, page, index) => {
      const previous = sorted[index - 1];
      if (previous !== undefined) {
        const gap = page - previous;
        // A gap of exactly one hidden page costs the same width as the
        // ellipsis that would replace it, so show the page instead.
        if (gap === 2) slots.push(previous + 1);
        else if (gap > 2) slots.push('ellipsis');
      }
      slots.push(page);
      return slots;
    }, []);
  });

  protected pageAriaLabel(page: number): string {
    return this.pageLabel()(page);
  }

  protected goTo(page: number): void {
    if (this.disabled()) return;
    const total = this.safeTotal();
    if (page < 1 || page > total || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  protected previous(): void {
    this.goTo(this.currentPage() - 1);
  }

  protected next(): void {
    this.goTo(this.currentPage() + 1);
  }

  private safeTotal(): number {
    const raw = Math.trunc(this.totalPages());
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return raw;
  }
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
