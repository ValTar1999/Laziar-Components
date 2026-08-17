import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function setPages(page: number, totalPages: number): void {
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('totalPages', totalPages);
    fixture.detectChanges();
  }

  function renderedSlots(): string[] {
    return Array.from(
      host().querySelectorAll<HTMLElement>('.lz-pagination__page, .lz-pagination__ellipsis'),
    ).map((el) => el.textContent?.trim() ?? '');
  }

  function stepButtons(): HTMLButtonElement[] {
    return Array.from(host().querySelectorAll('.lz-pagination__step'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.page()).toBe(1);
    expect(component.totalPages()).toBe(1);
    expect(component.size()).toBe('md');
    expect(component.disabled()).toBe(false);
    expect(component.hideOnSinglePage()).toBe(true);
  });

  it('should render nothing for a single page by default', () => {
    setPages(1, 1);
    expect(host().querySelector('.lz-pagination')).toBeNull();
  });

  it('should render a single page when hideOnSinglePage is false', () => {
    fixture.componentRef.setInput('hideOnSinglePage', false);
    setPages(1, 1);
    expect(host().querySelector('.lz-pagination')).not.toBeNull();
  });

  it('should enumerate every page when they all fit without a gap', () => {
    setPages(1, 7);
    expect(renderedSlots()).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });

  it('should elide with a trailing ellipsis near the start', () => {
    setPages(1, 20);
    expect(renderedSlots()).toEqual(['1', '2', '3', '…', '20']);
  });

  it('should elide on both sides in the middle', () => {
    setPages(10, 20);
    expect(renderedSlots()).toEqual(['1', '…', '9', '10', '11', '…', '20']);
  });

  it('should elide with a leading ellipsis near the end', () => {
    setPages(20, 20);
    expect(renderedSlots()).toEqual(['1', '…', '18', '19', '20']);
  });

  it('should render a hidden single page as that page rather than an ellipsis', () => {
    setPages(4, 9);
    // Page 2 is the only page between the boundary and the window, so it is
    // cheaper and clearer to show it than to hide one page behind a gap.
    expect(renderedSlots()).toEqual(['1', '2', '3', '4', '5', '…', '9']);
  });

  it('should mark the current page with aria-current', () => {
    setPages(3, 10);
    const current = host().querySelector('.lz-pagination__page--current');
    expect(current?.textContent?.trim()).toBe('3');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('should emit pageChange when another page is clicked', () => {
    const emitted: number[] = [];
    component.pageChange.subscribe((p) => emitted.push(p));
    setPages(1, 10);

    const pageTwo = Array.from(
      host().querySelectorAll<HTMLButtonElement>('.lz-pagination__page'),
    ).find((b) => b.textContent?.trim() === '2');
    pageTwo?.click();

    expect(emitted).toEqual([2]);
  });

  it('should not emit when the current page is clicked', () => {
    const emitted: number[] = [];
    component.pageChange.subscribe((p) => emitted.push(p));
    setPages(3, 10);

    host().querySelector<HTMLButtonElement>('.lz-pagination__page--current')?.click();

    expect(emitted).toEqual([]);
  });

  it('should disable previous on the first page and next on the last', () => {
    setPages(1, 5);
    expect(stepButtons()[0].disabled).toBe(true);
    expect(stepButtons()[1].disabled).toBe(false);

    setPages(5, 5);
    expect(stepButtons()[0].disabled).toBe(false);
    expect(stepButtons()[1].disabled).toBe(true);
  });

  it('should step through pages', () => {
    const emitted: number[] = [];
    component.pageChange.subscribe((p) => emitted.push(p));
    setPages(3, 10);

    stepButtons()[0].click();
    stepButtons()[1].click();

    expect(emitted).toEqual([2, 4]);
  });

  it('should emit nothing while disabled', () => {
    const emitted: number[] = [];
    component.pageChange.subscribe((p) => emitted.push(p));
    fixture.componentRef.setInput('disabled', true);
    setPages(3, 10);

    stepButtons()[1].click();

    expect(emitted).toEqual([]);
  });

  it('should clamp an out-of-range page instead of rendering a broken state', () => {
    setPages(99, 5);
    expect(host().querySelector('.lz-pagination__page--current')?.textContent?.trim()).toBe('5');

    setPages(0, 5);
    expect(host().querySelector('.lz-pagination__page--current')?.textContent?.trim()).toBe('1');
  });

  it('should treat a nonsensical total as one page', () => {
    fixture.componentRef.setInput('hideOnSinglePage', false);
    setPages(1, 0);
    expect(renderedSlots()).toEqual(['1']);
  });

  it('should use the pageLabel input for accessible page names', () => {
    fixture.componentRef.setInput('pageLabel', (p: number) => `Pagina ${p}`);
    setPages(1, 10);

    expect(host().querySelector('.lz-pagination__page')?.getAttribute('aria-label')).toBe(
      'Pagina 1',
    );
  });

  it('should hide a fractional single-page total rather than render a stray control', () => {
    // visible() must read the sanitised total; a raw 1.5 would slip past `> 1`.
    setPages(1, 1.5);
    expect(host().querySelector('.lz-pagination')).toBeNull();
  });
});
