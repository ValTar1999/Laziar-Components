import { TestBed } from '@angular/core/testing';
import { PulseDot } from './pulse-dot.component';

describe('PulseDot', () => {
  it('is decoration only: a ring and a core, both hidden from assistive tech', () => {
    const fixture = TestBed.createComponent(PulseDot);
    fixture.detectChanges();
    const parts: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.lz-pulse-dot > *'),
    );

    expect(parts.map((part) => part.className)).toEqual([
      'lz-pulse-dot__ring',
      'lz-pulse-dot__core',
    ]);
    expect(parts.every((part) => part.getAttribute('aria-hidden') === 'true')).toBeTrue();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});
