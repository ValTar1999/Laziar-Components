import { Component } from '@angular/core';
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

/**
 * `../ads-frontend` binds `<lz-logo link="…" ariaLabel="…" />` on its home shell and
 * its login screen. Driving the component through that template rather than through
 * `setInput` is what pins the selector and the input *names*: rename any of the three and
 * the tag matches nothing, no anchor renders, and this fails here instead of in the portal.
 */
@Component({
  imports: [Logo],
  template: '<lz-logo link="/dashboard" ariaLabel="Laziar" />',
})
class LogoConsumerHost {}

describe('Logo template contract', () => {
  it('keeps the selector and input names ../ads-frontend binds to', async () => {
    await TestBed.configureTestingModule({
      imports: [LogoConsumerHost],
      providers: [provideRouter([])],
    }).compileComponents();

    const host = TestBed.createComponent(LogoConsumerHost);
    host.detectChanges();

    const link = (host.nativeElement as HTMLElement).querySelector('lz-logo a');
    expect(link).withContext('<lz-logo> did not match the Logo component').toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/dashboard');
    expect(link?.getAttribute('aria-label')).toBe('Laziar');
  });
});
