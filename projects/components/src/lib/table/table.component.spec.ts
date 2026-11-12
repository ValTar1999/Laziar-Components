import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table.component';
import { lzTableNextSort, TableColumn, TableRow, TableSort } from './table.types';

describe('Table', () => {
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
    }).compileComponents();

    fixture = TestBed.createComponent(Table<TableRow>);
  });

  function headerCells(): HTMLTableCellElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('th.lz-table__header-cell'));
  }

  it('renders ariaSort as aria-sort on the header cell', () => {
    const columns: TableColumn[] = [
      { key: 'views', header: 'Views', ariaSort: 'descending' },
      { key: 'reads', header: 'Reads', ariaSort: 'none' },
      { key: 'title', header: 'Title' },
    ];
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('data', [{ views: 1, reads: 2, title: 'A' }]);
    fixture.detectChanges();

    const [views, reads, title] = headerCells();
    expect(views.getAttribute('aria-sort')).toBe('descending');
    expect(reads.getAttribute('aria-sort')).toBe('none');
    // An unsortable column must not claim a sort state at all.
    expect(title.hasAttribute('aria-sort')).toBe(false);
  });

  describe('sorting', () => {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'views', header: 'Views', sortable: true },
      { key: 'note', header: 'Note' },
    ];
    const sortButtons = (): HTMLButtonElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('.lz-table__sort-button'));

    let requested: TableSort[];

    beforeEach(() => {
      requested = [];
      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', [{ name: 'A', views: 1, note: '' }]);
      fixture.componentInstance.sortChange.subscribe((sort) => requested.push(sort));
    });

    it('turns only sortable headers into buttons named by the header', () => {
      fixture.detectChanges();

      expect(sortButtons().map((b) => b.textContent?.trim())).toEqual(['Name', 'Views']);
      expect(headerCells()[2].querySelector('button')).toBeNull();
    });

    it('sets aria-sort on the sorted column only, and draws its direction', () => {
      fixture.componentRef.setInput('sortKey', 'views');
      fixture.componentRef.setInput('sortDirection', 'desc');
      fixture.detectChanges();

      const [name, views, note] = headerCells();
      expect(name.hasAttribute('aria-sort')).toBe(false);
      expect(views.getAttribute('aria-sort')).toBe('descending');
      expect(note.hasAttribute('aria-sort')).toBe(false);
      expect(sortButtons()[1].getAttribute('data-sorted')).toBe('true');
    });

    it('asks to flip the sorted column, and to sort another one ascending', () => {
      fixture.componentRef.setInput('sortKey', 'name');
      fixture.componentRef.setInput('sortDirection', 'asc');
      fixture.detectChanges();

      sortButtons()[0].click();
      sortButtons()[1].click();

      expect(requested).toEqual([
        { key: 'name', direction: 'desc' },
        { key: 'views', direction: 'asc' },
      ]);
    });

    it('leaves the rows in the order it was given', () => {
      fixture.componentRef.setInput('data', [
        { name: 'B', views: 1, note: '' },
        { name: 'A', views: 2, note: '' },
      ]);
      fixture.componentRef.setInput('sortKey', 'name');
      fixture.detectChanges();

      const firstCells = Array.from(
        fixture.nativeElement.querySelectorAll('tbody tr td:first-child'),
      ).map((td) => (td as HTMLElement).textContent?.trim());
      expect(firstCells).toEqual(['B', 'A']);
    });
  });

  describe('lzTableNextSort', () => {
    it('starts ascending, flips the same column, and resets on a new one', () => {
      expect(lzTableNextSort(null, 'a')).toEqual({ key: 'a', direction: 'asc' });
      expect(lzTableNextSort({ key: 'a', direction: 'asc' }, 'a')).toEqual({
        key: 'a',
        direction: 'desc',
      });
      expect(lzTableNextSort({ key: 'a', direction: 'desc' }, 'b')).toEqual({
        key: 'b',
        direction: 'asc',
      });
    });
  });

  it('keeps a hidden header for screen readers only', () => {
    fixture.componentRef.setInput('columns', [
      { key: 'actions', header: 'Actions', hideHeader: true },
    ]);
    fixture.detectChanges();

    const hidden = headerCells()[0].querySelector('.lz-table__visually-hidden');
    expect(hidden?.textContent?.trim()).toBe('Actions');
  });

  describe('row clicks', () => {
    const rows = [
      { id: 7, name: 'Seven' },
      { id: 8, name: 'Eight' },
    ];
    let clicked: unknown[];

    function render(): void {
      fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Name' }]);
      fixture.componentRef.setInput('data', rows);
      fixture.componentRef.setInput('rowClickable', true);
      fixture.componentInstance.rowClick.subscribe((row) => clicked.push(row));
      fixture.detectChanges();
    }

    const bodyRows = (): HTMLTableRowElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('tbody tr.lz-table__row'));

    beforeEach(() => (clicked = []));

    it('emits the row for a click anywhere in it', () => {
      render();
      bodyRows()[1].querySelector('td')!.click();

      expect(clicked).toEqual([rows[1]]);
    });

    it('ignores clicks and Enter on a control inside the row', () => {
      render();
      const button = document.createElement('button');
      const icon = document.createElement('span');
      button.appendChild(icon);
      bodyRows()[0].querySelector('td')!.appendChild(button);

      icon.click();
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(clicked).toEqual([]);
    });

    it('makes interactive rows keyboard stops by default', () => {
      render();
      const [row] = bodyRows();
      expect(row.getAttribute('tabindex')).toBe('0');
      // Still a row: another role would cut its cells out of the table.
      expect(row.hasAttribute('role')).toBe(false);

      row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(clicked).toEqual([rows[0]]);
    });

    it('keeps pointer-only rows out of the tab order when rowFocusable is off', () => {
      fixture.componentRef.setInput('rowFocusable', false);
      render();
      const [row] = bodyRows();

      expect(row.hasAttribute('tabindex')).toBe(false);
      expect(row.hasAttribute('role')).toBe(false);
      row.querySelector('td')!.click();
      expect(clicked).toEqual([rows[0]]);
    });

    it('keeps a row element with its row across a re-sort when given a rowKey', () => {
      fixture.componentRef.setInput('rowKey', 'id');
      render();
      const seven = bodyRows()[0];

      fixture.componentRef.setInput('data', [rows[1], rows[0]]);
      fixture.detectChanges();

      expect(bodyRows()[1]).toBe(seven);
    });
  });
});
