import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Expand } from './expand.component';

describe('Expand', () => {
  let fixture: ComponentFixture<Expand>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Expand] });
    fixture = TestBed.createComponent(Expand);
  });

  it('renders the expand title and content as inner HTML', () => {
    fixture.componentRef.setInput('title', 'Read more');
    fixture.componentRef.setInput('content', 'The <b>full</b> story');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.lz-expand__title')?.textContent).toBe('Read more');
    const content = host.querySelector('.lz-expand__content .lz-expand__body');
    expect(content?.textContent).toBe('The full story');
    expect(content?.querySelector('b')?.textContent).toBe('full');
  });

  it('renders the trigger button and an open content panel', () => {
    fixture.componentRef.setInput('title', 'Title');
    fixture.componentRef.setInput('content', 'Body');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('button.lz-expand__trigger')).not.toBeNull();
    expect(host.querySelector('.lz-expand__content--open')).not.toBeNull();
  });

  it('hides the content after the trigger is clicked', () => {
    fixture.componentRef.setInput('title', 'Title');
    fixture.componentRef.setInput('content', 'Body');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    host.querySelector('button')?.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(host.querySelector('.lz-expand__content--open')).toBeNull();
    expect(host.querySelector('.lz-expand__chevron--open')).toBeNull();

    host.querySelector('button')?.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(host.querySelector('.lz-expand__content--open')).not.toBeNull();
    expect(host.querySelector('.lz-expand__chevron--open')).not.toBeNull();
  });
});
