import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import { TableColumn, TablePaginationItem, TableRow } from './table.types';

@Component({
  selector: 'lz-table',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Button, NgTemplateOutlet, Icon],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lz-table-host' },
})
export class Table implements OnDestroy {
  readonly columns = input<readonly TableColumn[]>([]);
  readonly data = input<readonly TableRow[]>([]);
  readonly showShadow = input(true, { transform: booleanAttribute });
  readonly emptyMessage = input<string | undefined>(undefined);
  readonly elevatedRowId = input<string | number | null>(null);
  readonly elevatedRowIdField = input('id');
  readonly rowClickable = input(false, { transform: booleanAttribute });
  readonly isRowInteractive = input<((row: TableRow) => boolean) | undefined>(undefined);
  readonly getRowClass = input<((row: TableRow) => string) | undefined>(undefined);
  readonly getRowRole = input<((row: TableRow) => string | null) | undefined>(undefined);
  readonly getRowAriaLabel = input<((row: TableRow) => string | null) | undefined>(undefined);
  readonly scrollMaxHeight = input<string | undefined>(undefined);
  readonly showScrollbar = input(false, { transform: booleanAttribute });
  readonly tableLabelledBy = input<string | undefined>(undefined);

  readonly showResultsCount = input(false, { transform: booleanAttribute });
  readonly resultsCount = input<number | undefined>(undefined);
  readonly resultsCountSingular = input('rezultat');
  readonly resultsCountPlural = input('rezultate');

  readonly showPagination = input(false, { transform: booleanAttribute });
  readonly currentPage = input(1);
  readonly pageSize = input(10);
  readonly totalItems = input(0);
  readonly pageSizeOptions = input<readonly number[]>([10, 25, 50, 100]);
  readonly paginationBusy = input(false, { transform: booleanAttribute });
  /** e.g. "Showing" — wraps rangeStart–rangeEnd */
  readonly paginationShowingLabel = input('Afișare');
  /** e.g. "of" — between rangeEnd and total */
  readonly paginationOfLabel = input('din');
  /** e.g. "results" — after total count */
  readonly paginationResultsLabel = input('rezultate');
  readonly pageSizeAriaLabel = input('Rezultate pe pagină');

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly rowClick = output<TableRow>();

  protected readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  private readonly pageSizeMenuRoot = viewChild<ElementRef<HTMLElement>>('pageSizeMenuRoot');
  protected readonly cellTemplate = contentChild<TemplateRef<unknown>>('cellTemplate');
  protected readonly headerTemplate = contentChild<TemplateRef<unknown>>('headerTemplate');
  protected readonly rowDetailTemplate = contentChild<TemplateRef<unknown>>('rowDetailTemplate');

  protected readonly isScrolledToEnd = signal(false);
  protected readonly pageSizeDropdownOpen = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private scrollHandler?: () => void;

  protected readonly displayedResultsCount = computed(
    () => this.resultsCount() ?? this.data().length,
  );
  protected readonly resultsCountLabel = computed(() =>
    this.displayedResultsCount() === 1 ? this.resultsCountSingular() : this.resultsCountPlural(),
  );
  protected readonly paginationItemCount = computed(() =>
    this.totalItems() > 0 ? this.totalItems() : this.data().length,
  );
  protected readonly paginationTotalPages = computed(() => {
    const itemCount = this.paginationItemCount();
    return itemCount <= 0 || this.pageSize() <= 0
      ? 1
      : Math.max(1, Math.ceil(itemCount / this.pageSize()));
  });
  protected readonly clampedPage = computed(() =>
    Math.min(Math.max(1, this.currentPage()), this.paginationTotalPages()),
  );
  protected readonly rangeStart = computed(() =>
    this.paginationItemCount() <= 0 ? 0 : (this.clampedPage() - 1) * this.pageSize() + 1,
  );
  protected readonly rangeEnd = computed(() =>
    Math.min(this.clampedPage() * this.pageSize(), this.paginationItemCount()),
  );
  protected readonly pageItems = computed<TablePaginationItem[]>(() => {
    const total = this.paginationTotalPages();
    const current = this.clampedPage();
    if (total <= 1) return [1];
    if (total <= 9) return Array.from({ length: total }, (_, index) => index + 1);

    const pages = new Set<number>([1, total]);
    for (let page = current - 1; page <= current + 1; page += 1) {
      if (page >= 1 && page <= total) pages.add(page);
    }
    if (current <= 4) {
      for (let page = 2; page <= Math.min(5, total - 1); page += 1) pages.add(page);
    }
    if (current >= total - 3) {
      for (let page = Math.max(total - 4, 2); page < total; page += 1) pages.add(page);
    }

    const items: TablePaginationItem[] = [];
    let previous = 0;
    for (const page of [...pages].sort((a, b) => a - b)) {
      if (previous > 0 && page - previous > 1) items.push('ellipsis');
      items.push(page);
      previous = page;
    }
    return items;
  });

  constructor() {
    afterNextRender(() => this.attachScrollListener());
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.pageSizeDropdownOpen()) return;
    const root = this.pageSizeMenuRoot()?.nativeElement;
    if (root?.contains(event.target as Node | null)) return;
    this.pageSizeDropdownOpen.set(false);
  }

  ngOnDestroy(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (container && this.scrollHandler)
      container.removeEventListener('scroll', this.scrollHandler);
  }

  protected getValue(row: TableRow, column: TableColumn): unknown {
    return row[column.key];
  }

  /** Publikators treat `minWidth` / `width` as Tailwind (or other) class strings. */
  protected widthClasses(column: TableColumn): string {
    return [column.minWidth, column.width].filter(Boolean).join(' ');
  }

  protected headerCellClass(column: TableColumn): string {
    return [column.headerClass, this.widthClasses(column)].filter(Boolean).join(' ');
  }

  protected bodyCellClass(column: TableColumn): string {
    return [column.cellClass, this.widthClasses(column)].filter(Boolean).join(' ');
  }

  protected isElevatedStickyCell(row: TableRow, column: TableColumn): boolean {
    return (
      column.key === 'actions' &&
      this.elevatedRowId() !== null &&
      row[this.elevatedRowIdField()] === this.elevatedRowId()
    );
  }

  protected canInteractWithRow(row: TableRow): boolean {
    return this.isRowInteractive()?.(row) ?? this.rowClickable();
  }

  protected resolveRowClass(row: TableRow): string {
    return this.getRowClass() ? this.getRowClass()!(row) : '';
  }

  protected resolveRowRole(row: TableRow): string | null {
    return this.getRowRole()
      ? this.getRowRole()!(row)
      : this.canInteractWithRow(row)
        ? 'link'
        : null;
  }

  protected resolveRowAriaLabel(row: TableRow): string | null {
    return this.getRowAriaLabel()?.(row) ?? null;
  }

  protected shouldShowRowDetail(row: TableRow): boolean {
    return !!this.rowDetailTemplate() && !!this.isRowDetailExpanded()?.(row);
  }

  readonly isRowDetailExpanded = input<((row: TableRow) => boolean) | undefined>(undefined);

  protected onRowClick(row: TableRow): void {
    if (this.canInteractWithRow(row)) this.rowClick.emit(row);
  }

  protected onRowKeydown(event: KeyboardEvent, row: TableRow): void {
    if (!this.canInteractWithRow(row) || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    this.rowClick.emit(row);
  }

  protected isEllipsis(item: TablePaginationItem): item is 'ellipsis' {
    return item === 'ellipsis';
  }

  protected togglePageSizeDropdown(): void {
    if (!this.paginationBusy()) this.pageSizeDropdownOpen.update((open) => !open);
  }

  protected selectPageSize(option: number): void {
    this.pageSizeDropdownOpen.set(false);
    if (
      this.paginationBusy() ||
      !Number.isFinite(option) ||
      option <= 0 ||
      option === this.pageSize()
    )
      return;
    this.pageSizeChange.emit(option);
  }

  protected goPage(page: number): void {
    if (
      this.paginationBusy() ||
      page === this.clampedPage() ||
      page < 1 ||
      page > this.paginationTotalPages()
    )
      return;
    this.pageChange.emit(page);
  }

  protected goPrev(): void {
    this.goPage(this.clampedPage() - 1);
  }

  protected goNext(): void {
    this.goPage(this.clampedPage() + 1);
  }

  private attachScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;
    this.checkScrollPosition();
    this.scrollHandler = () => this.checkScrollPosition();
    container.addEventListener('scroll', this.scrollHandler);
  }

  private checkScrollPosition(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;
    this.isScrolledToEnd.set(
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 1,
    );
  }
}
