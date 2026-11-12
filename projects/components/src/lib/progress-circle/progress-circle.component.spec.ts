import { TestBed } from '@angular/core/testing';
import { ProgressCircle } from './progress-circle.component';

describe('ProgressCircle', () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ProgressCircle);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  const arc = (root: HTMLElement): SVGCircleElement =>
    root.querySelector('.lz-progress-circle__arc')!;
  const offsetShare = (root: HTMLElement): number =>
    Number(arc(root).getAttribute('stroke-dashoffset')) /
    Number(arc(root).getAttribute('stroke-dasharray'));

  it('reports its value as a progressbar', () => {
    const bar = create({ progress: 40 }).nativeElement.querySelector('[role="progressbar"]');

    expect(bar.getAttribute('aria-label')).toBe('Progress');
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('leaves the unfilled share of the ring as the dash offset', () => {
    expect(offsetShare(create({ progress: 75 }).nativeElement)).toBeCloseTo(0.25, 5);
    expect(offsetShare(create({ progress: 0 }).nativeElement)).toBeCloseTo(1, 5);
  });

  it('draws a full or empty ring for values outside 0 to 100', () => {
    expect(offsetShare(create({ progress: 140 }).nativeElement)).toBeCloseTo(0, 5);
    expect(offsetShare(create({ progress: -5 }).nativeElement)).toBeCloseTo(1, 5);
  });

  it('accepts the value as an attribute string', () => {
    expect(offsetShare(create({ progress: '50' }).nativeElement)).toBeCloseTo(0.5, 5);
  });

  it('prints the percentage only on the sizes with room for it', () => {
    const label = (size: string): string | undefined =>
      create({ progress: 40, size })
        .nativeElement.querySelector('.lz-progress-circle__label')
        ?.textContent?.trim();

    expect(label('md')).toBeUndefined();
    expect(label('lg')).toBe('40%');
    expect(label('xxl')).toBe('40%');
  });
});
