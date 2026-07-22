import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { LZ_THEME_STORAGE_KEY } from './theme.types';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.removeItem(LZ_THEME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('should default to auto and set data-theme', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('auto');
    expect(document.documentElement.getAttribute('data-theme')).toBe('auto');
  });

  it('should persist light mode', () => {
    const service = TestBed.inject(ThemeService);
    service.setMode('light');
    expect(service.mode()).toBe('light');
    expect(service.resolved()).toBe('light');
    expect(localStorage.getItem(LZ_THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should persist dark mode', () => {
    const service = TestBed.inject(ThemeService);
    service.setMode('dark');
    expect(service.resolved()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
