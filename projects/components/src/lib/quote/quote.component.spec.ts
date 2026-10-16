import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Quote } from './quote.component';

describe('Quote', () => {
  let fixture: ComponentFixture<Quote>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Quote] });
    fixture = TestBed.createComponent(Quote);
  });

  it('renders the quote body as inner HTML of the blockquote', () => {
    fixture.componentRef.setInput('content', 'To be or not to be');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('blockquote')?.textContent).toBe('To be or not to be');
  });

  it('renders the author name, role and subtext when present', () => {
    fixture.componentRef.setInput('content', 'Quote');
    fixture.componentRef.setInput('author', { fullName: 'Jane Doe', position: 'CEO' });
    fixture.componentRef.setInput('subtext', 'Annual report');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const figcaption = host.querySelector('figcaption');
    const authorSpans = figcaption?.querySelectorAll('span') ?? [];
    expect(figcaption).not.toBeNull();
    expect(authorSpans[0]?.textContent).toBe('Jane Doe');
    expect(authorSpans[1]?.textContent).toBe('CEO');
    expect(host.querySelector('.lz-quote__caption')?.textContent?.trim()).toBe('Annual report');
  });

  it('omits the footer when there is no author or subtext', () => {
    fixture.componentRef.setInput('content', 'Quote');
    fixture.componentRef.setInput('author', null);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('figcaption')).toBeNull();
  });
});
