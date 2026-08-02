import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TabButton } from './tab-button.component';

describe('TabButton', () => {
  let component: TabButton;
  let fixture: ComponentFixture<TabButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabButton, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TabButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.lz-tab-button__control')?.textContent?.trim()).toBe('Tab');
  });

  it('should render a button when no link is provided', () => {
    const control = fixture.nativeElement.querySelector('.lz-tab-button__control');
    expect(control?.tagName.toLowerCase()).toBe('button');
  });

  it('should apply active attributes when active', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    expect(root?.getAttribute('data-active')).toBe('true');
    expect(root?.getAttribute('data-variant')).toBe('solid');
  });

  it('should show line indicator when line variant is active', () => {
    fixture.componentRef.setInput('variant', 'line');
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    const line = fixture.nativeElement.querySelector('.lz-tab-button__line');
    expect(root?.getAttribute('data-variant')).toBe('line');
    expect(root?.getAttribute('data-active')).toBe('true');
    expect(line).toBeTruthy();
  });

  it('should apply size attribute', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    expect(root?.getAttribute('data-size')).toBe('lg');
  });

  it('should apply sm size attribute', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    expect(root?.getAttribute('data-size')).toBe('sm');
  });

  it('should render an anchor with router link when provided', () => {
    fixture.componentRef.setInput('link', '/test');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a.lz-tab-button__control');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('ng-reflect-router-link')).toBe('/test');
  });
});
