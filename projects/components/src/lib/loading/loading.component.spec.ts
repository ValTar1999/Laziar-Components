import { TestBed } from '@angular/core/testing';
import { Loading } from './loading.component';

describe('Loading', () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Loading);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it('is a status region with a spinner by default', () => {
    const root: HTMLElement = create().nativeElement;
    const status = root.querySelector('[role="status"]')!;

    expect(status.getAttribute('aria-label')).toBe('Loading');
    expect(status.getAttribute('data-variant')).toBe('spinner');
    expect(root.querySelector('.lz-loading__spinner')).not.toBeNull();
    expect(root.querySelector('.lz-loading__dots')).toBeNull();
  });

  it('takes a localized label', () => {
    const root: HTMLElement = create({ ariaLabel: 'Se încarcă' }).nativeElement;

    expect(root.querySelector('[role="status"]')!.getAttribute('aria-label')).toBe('Se încarcă');
  });

  it('draws eight dots, each starting a little later, for the dots variant', () => {
    const root: HTMLElement = create({ variant: 'dots', color: 'red', size: 'sm' }).nativeElement;
    const dots: HTMLElement[] = Array.from(root.querySelectorAll('.lz-loading__dot'));

    expect(root.querySelector('.lz-loading__spinner')).toBeNull();
    expect(dots.length).toBe(8);
    dots.forEach((dot, index) =>
      expect(Number.parseFloat(dot.style.animationDelay)).toBeCloseTo(index * 0.1, 5),
    );
    expect(root.querySelector('.lz-loading')!.getAttribute('data-color')).toBe('red');
    expect(root.querySelector('.lz-loading')!.getAttribute('data-size')).toBe('sm');
  });
});
