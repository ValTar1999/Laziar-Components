import { isPlatformBrowser, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
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
  ViewContainerRef,
} from '@angular/core';
import { attachLzFloating } from '../floating/floating';
import { moveFocusWithKeys } from '../internal/list-keys';
import { LzInputFlush } from '../internal/lz-input-flush.directive';

import { Button } from '../button/button.component';
import { Icon } from '../icon/icon.component';
import {
  lzTableNextSort,
  lzTableUtilityToCss,
  TableColumn,
  TablePaginationItem,
  TableRow,
  TableSort,
  TableSortDirection,
} from './table.types';

let nextTableId = 0;

const MENU_OFFSET_PX = 8;
const MENU_VIEWPORT_PADDING_PX = 8;

/**
 * What a click inside a row may land on that does something of its own. Those
 * clicks belong to the control, not to the row, so they do not emit `rowClick`.
 */
const ROW_OWN_CONTROLS = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  'summary',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="menuitem"]',
  '[role="tab"]',
].join(', ');

function floatingUiPositionStrategy(): PositionStrategy {
  return {
    attach: () => undefined,
    apply: () => undefined,
    detach: () => undefined,
    dispose: () => undefined,
  };
}

@Component({
  selector: 'lz-table',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [Button, NgTemplateOutlet, NgClass, NgStyle, Icon, OverlayModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lz-table-host' },
})
/**
 * Generic over the row type, so an app hands over its own row interfaces and gets
 * them back from `rowClick` and the row callbacks; `TableRow` when unspecified.
 */
export class Table<T extends object = TableRow> implements OnDestroy {
  readonly columns = input<readonly TableColumn[]>([]);
  readonly data = input<readonly T[]>([]);
  readonly showShadow = input(true, { transform: booleanAttribute });
  readonly emptyMessage = input<string | undefined>(undefined);
  readonly elevatedRowId = input<string | number | null>(null);
  readonly elevatedRowIdField = input('id');
  readonly rowClickable = input(false, { transform: booleanAttribute });
  readonly isRowInteractive = input<((row: T) => boolean) | undefined>(undefined);
  /**
   * Whether an interactive row is also a keyboard stop (`tabindex=0`; Enter and
   * Space activate it). Turn it off when the row is only a pointer shortcut to
   * something the keyboard already reaches inside the row, such as a menu item,
   * so Tab is not doubled.
   *
   * The row keeps its `row` role, so its cells are still read as a table; give
   * it another one through `getRowRole` only if you know the cells do not matter.
   */
  readonly rowFocusable = input(true, { transform: booleanAttribute });
  readonly getRowClass = input<((row: T) => string) | undefined>(undefined);
  readonly getRowRole = input<((row: T) => string | null) | undefined>(undefined);
  readonly getRowAriaLabel = input<((row: T) => string | null) | undefined>(undefined);
  /**
   * Identifies a row across changes to `data`: a field name, or a function. Rows
   * are otherwise tracked by position, so after a re-sort the components in a cell
   * (an open menu, a busy button) would stay with the position, not with the row.
   */
  readonly rowKey = input<string | ((row: T) => unknown) | null>(null);
  readonly scrollMaxHeight = input<string | undefined>(undefined);
  readonly showScrollbar = input(false, { transform: booleanAttribute });
  readonly tableLabelledBy = input<string | undefined>(undefined);
  readonly isRowDetailExpanded = input<((row: T) => boolean) | undefined>(undefined);

  /** The `sortable` column the rows are sorted by; null when none is. */
  readonly sortKey = input<string | null>(null);
  readonly sortDirection = input<TableSortDirection>('asc');

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
  readonly paginationShowingLabel = input('Afișare');
  readonly paginationOfLabel = input('din');
  readonly paginationResultsLabel = input('rezultate');
  readonly pageSizeAriaLabel = input('Rezultate pe pagină');
  /** Accessible names of the pager and its arrows; pass localized strings. */
  readonly paginationAriaLabel = input('Paginare');
  readonly previousPageLabel = input('Pagina anterioară');
  readonly nextPageLabel = input('Pagina următoare');

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly rowClick = output<T>();
  /** A sortable header was clicked: the sort it asks for (see `lzTableNextSort`). */
  readonly sortChange = output<TableSort>();

  readonly paneClass = 'lz-table-cdk-pane';
  protected readonly pageSizeMenuId = `lz-table-page-size-${nextTableId++}`;

  protected readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  protected readonly pageSizeTrigger = viewChild<ElementRef<HTMLElement>>('pageSizeTrigger');
  protected readonly pageSizeMenuTpl = viewChild<TemplateRef<unknown>>('pageSizeMenuTpl');
  protected readonly cellTemplate = contentChild<TemplateRef<unknown>>('cellTemplate');
  protected readonly headerTemplate = contentChild<TemplateRef<unknown>>('headerTemplate');
  protected readonly rowDetailTemplate = contentChild<TemplateRef<unknown>>('rowDetailTemplate');

  protected readonly isScrolledToEnd = signal(false);
  protected readonly pageSizeDropdownOpen = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private overlayRef?: OverlayRef;
  private floatingCleanup?: () => void;
  private scrollHandler?: () => void;
  private resizeObserver?: ResizeObserver;

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
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (this.pageSizeTrigger()?.nativeElement.contains(target)) return;
    if (this.overlayRef?.overlayElement.contains(target)) return;
    this.closePageSizeMenu();
  }

  /** Claims the key so an enclosing `lz-modal` leaves this Escape to the list. */
  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event?: Event): void {
    if (!this.pageSizeDropdownOpen()) return;
    event?.preventDefault();
    this.closePageSizeMenu();
  }

  ngOnDestroy(): void {
    const container = this.scrollContainer()?.nativeElement;
    this.resizeObserver?.disconnect();
    if (container && this.scrollHandler) {
      container.removeEventListener('scroll', this.scrollHandler);
    }
    this.teardownOverlay();
  }

  protected getValue(row: T, column: TableColumn): unknown {
    return (row as Record<string, unknown>)[column.key];
  }

  protected trackRow(row: T, index: number): unknown {
    const key = this.rowKey();
    if (key == null) return index;
    return typeof key === 'function' ? key(row) : (row as Record<string, unknown>)[key];
  }

  protected isSortedBy(column: TableColumn): boolean {
    return !!column.sortable && this.sortKey() === column.key;
  }

  protected resolveAriaSort(column: TableColumn): string | null {
    if (column.ariaSort) return column.ariaSort;
    if (!this.isSortedBy(column)) return null;
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  protected sortIcon(column: TableColumn): string {
    if (!this.isSortedBy(column)) return 'chevron-up-down';
    return this.sortDirection() === 'asc' ? 'chevron-up' : 'chevron-down';
  }

  protected requestSort(column: TableColumn): void {
    const key = this.sortKey();
    this.sortChange.emit(
      lzTableNextSort(key == null ? null : { key, direction: this.sortDirection() }, column.key),
    );
  }

  protected columnStyle(column: TableColumn): Record<string, string> {
    const style: Record<string, string> = {};
    const minWidth = lzTableUtilityToCss(column.minWidth);
    const width = lzTableUtilityToCss(column.width);
    if (minWidth) style['min-width'] = minWidth;
    if (width) style['width'] = width;
    return style;
  }

  protected extraCellClass(column: TableColumn, kind: 'header' | 'cell'): string {
    const named = kind === 'header' ? column.headerClass : column.cellClass;
    const leftover = [column.minWidth, column.width].filter(
      (value) => value && !lzTableUtilityToCss(value),
    );
    return [named, ...leftover].filter(Boolean).join(' ');
  }

  protected isElevatedStickyCell(row: T, column: TableColumn): boolean {
    return (
      column.key === 'actions' &&
      this.elevatedRowId() !== null &&
      (row as Record<string, unknown>)[this.elevatedRowIdField()] === this.elevatedRowId()
    );
  }

  protected canInteractWithRow(row: T): boolean {
    return this.isRowInteractive()?.(row) ?? this.rowClickable();
  }

  protected isRowFocusable(row: T): boolean {
    return this.rowFocusable() && this.canInteractWithRow(row);
  }

  protected resolveRowClass(row: T): string {
    return this.getRowClass()?.(row) ?? '';
  }

  protected resolveRowRole(row: T): string | null {
    return this.getRowRole()?.(row) ?? null;
  }

  protected resolveRowAriaLabel(row: T): string | null {
    return this.getRowAriaLabel()?.(row) ?? null;
  }

  protected shouldShowRowDetail(row: T): boolean {
    return !!this.rowDetailTemplate() && !!this.isRowDetailExpanded()?.(row);
  }

  protected onRowClick(event: Event, row: T): void {
    if (!this.canInteractWithRow(row) || this.landedOnOwnControl(event)) return;
    this.rowClick.emit(row);
  }

  protected onRowKeydown(event: KeyboardEvent, row: T): void {
    if (!this.isRowFocusable(row) || (event.key !== 'Enter' && event.key !== ' ')) return;
    // Enter on a button in the row is that button's own, and bubbles here too.
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    this.rowClick.emit(row);
  }

  /** Whether a click came from a control inside the row rather than the row itself. */
  private landedOnOwnControl(event: Event): boolean {
    const row = event.currentTarget as Element | null;
    const target = event.target as Element | null;
    const control = target?.closest?.(ROW_OWN_CONTROLS);
    return !!control && control !== row && !!row?.contains(control);
  }

  protected isEllipsis(item: TablePaginationItem): item is 'ellipsis' {
    return item === 'ellipsis';
  }

  protected togglePageSizeDropdown(): void {
    if (this.paginationBusy()) return;
    if (this.pageSizeDropdownOpen()) {
      this.closePageSizeMenu();
      return;
    }
    this.pageSizeDropdownOpen.set(true);
    this.attachPageSizeOverlay();
    this.focusPageSizeOption();
  }

  protected onPageSizeOptionKeydown(event: KeyboardEvent): void {
    // Tab closes the list and carries on from the trigger: the list lives at
    // the end of the document, so tabbing out of it would leave the page.
    if (event.key === 'Tab') {
      this.closePageSizeMenu();
      return;
    }
    moveFocusWithKeys(event, this.pageSizeOptionElements());
  }

  protected selectPageSize(option: number): void {
    this.closePageSizeMenu();
    if (
      this.paginationBusy() ||
      !Number.isFinite(option) ||
      option <= 0 ||
      option === this.pageSize()
    ) {
      return;
    }
    this.pageSizeChange.emit(option);
  }

  protected goPage(page: number): void {
    if (
      this.paginationBusy() ||
      page === this.clampedPage() ||
      page < 1 ||
      page > this.paginationTotalPages()
    ) {
      return;
    }
    this.pageChange.emit(page);
  }

  protected goPrev(): void {
    this.goPage(this.clampedPage() - 1);
  }

  protected goNext(): void {
    this.goPage(this.clampedPage() + 1);
  }

  private closePageSizeMenu(): void {
    this.pageSizeDropdownOpen.set(false);

    // Focus that was in the list goes back to the trigger, not to the page top.
    const overlayElement = this.overlayRef?.overlayElement;
    const hadFocus = !!overlayElement?.contains(overlayElement.ownerDocument.activeElement);
    this.detachOverlay();
    if (hadFocus) {
      this.pageSizeTrigger()?.nativeElement.querySelector('button')?.focus();
    }
  }

  private pageSizeOptionElements(): HTMLElement[] {
    return Array.from(
      this.overlayRef?.overlayElement.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
    );
  }

  /** Opening lands on the current size, so the arrows start from it. */
  private focusPageSizeOption(): void {
    const options = this.pageSizeOptionElements();
    (
      options.find((option) => option.getAttribute('aria-selected') === 'true') ?? options[0]
    )?.focus();
  }

  private attachPageSizeOverlay(): void {
    const tpl = this.pageSizeMenuTpl();
    if (!tpl) return;

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        panelClass: this.paneClass,
        positionStrategy: floatingUiPositionStrategy(),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(new TemplatePortal(tpl, this.vcr));
    }

    this.startFloating();
  }

  private detachOverlay(): void {
    this.stopFloating();
    this.overlayRef?.detach();
  }

  private teardownOverlay(): void {
    this.stopFloating();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  private startFloating(): void {
    this.stopFloating();
    const reference = this.pageSizeTrigger()?.nativeElement;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) return;

    this.floatingCleanup = attachLzFloating(reference, floating, {
      placement: 'bottom-start',
      offset: MENU_OFFSET_PX,
      shiftPadding: MENU_VIEWPORT_PADDING_PX,
      flipPadding: MENU_VIEWPORT_PADDING_PX,
      strategy: 'fixed',
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }

  private attachScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;
    this.checkScrollPosition();
    this.scrollHandler = () => this.checkScrollPosition();
    container.addEventListener('scroll', this.scrollHandler);

    // Rows that arrive after the first render, or a narrower window, change
    // whether the table overflows without any scroll event to say so.
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => this.checkScrollPosition());
      this.resizeObserver.observe(container);
      const content = container.firstElementChild;
      if (content) this.resizeObserver.observe(content);
    }
  }

  private checkScrollPosition(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;
    this.isScrolledToEnd.set(
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 1,
    );
  }
}
