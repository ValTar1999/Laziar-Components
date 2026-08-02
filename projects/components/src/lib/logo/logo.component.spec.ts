import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Logo } from './logo.component';

describe('Logo', () => {
  let fixture: ComponentFixture<Logo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Logo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the logo svg', () => {
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 78 32');
  });

  it('wraps the logo in a home link with defaults', () => {
    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/');
    expect(link?.getAttribute('aria-label')).toBe('Laziar acasă');
  });

  it('applies custom link and ariaLabel inputs', () => {
    fixture.componentRef.setInput('link', '/home');
    fixture.componentRef.setInput('ariaLabel', 'Acasă');
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/home');
    expect(link?.getAttribute('aria-label')).toBe('Acasă');
  });
});
