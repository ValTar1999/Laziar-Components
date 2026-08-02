import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badge } from './badge.component';

describe('Badge', () => {
  let component: Badge;
  let fixture: ComponentFixture<Badge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge],
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function badgeEl(): HTMLElement {
    return fixture.nativeElement.querySelector('.lz-badge');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.color()).toBe('gray');
    expect(component.size()).toBe('sm');
    expect(component.iconPosition()).toBe('left');
    expect(component.iconClickable()).toBe(false);
    expect(component.iconAriaLabel()).toBe('');
    expect(component.border()).toBe(false);
    expect(component.pill()).toBe(false);
    expect(component.disabled()).toBe(false);
  });

  it('should apply data-size for sm, md, lg', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(badgeEl().getAttribute('data-size')).toBe(size);
    }
  });

  it('should keep data-size when icon is set', () => {
    fixture.componentRef.setInput('size', 'md');
    fixture.componentRef.setInput('icon', 'check');
    fixture.detectChanges();

    expect(badgeEl().getAttribute('data-size')).toBe('md');
    expect(badgeEl().getAttribute('data-icon-position')).toBe('left');
  });

  it('should resolve magrnta alias to magenta data-color', () => {
    fixture.componentRef.setInput('color', 'magrnta');
    fixture.detectChanges();

    expect(component['resolvedColor']()).toBe('magenta');
    expect(badgeEl().getAttribute('data-color')).toBe('magenta');
  });

  it('should emit iconClick when icon is clickable and clicked', () => {
    const spy = jasmine.createSpy('iconClick');
    component.iconClick.subscribe(spy);

    fixture.componentRef.setInput('iconClickable', true);
    fixture.componentRef.setInput('disabled', false);
    component['onIconClick']();

    expect(spy).toHaveBeenCalled();
  });

  it('should not emit iconClick when disabled', () => {
    const spy = jasmine.createSpy('iconClick');
    component.iconClick.subscribe(spy);

    fixture.componentRef.setInput('iconClickable', true);
    fixture.componentRef.setInput('disabled', true);
    component['onIconClick']();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should compute hasIcon correctly', () => {
    expect(component['hasIcon']()).toBe(false);

    fixture.componentRef.setInput('icon', 'test-icon');
    fixture.detectChanges();

    expect(component['hasIcon']()).toBe(true);
  });
});
