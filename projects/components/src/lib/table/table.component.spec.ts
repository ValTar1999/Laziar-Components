import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table.component';
import { TableColumn } from './table.types';

describe('Table', () => {
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
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
});
