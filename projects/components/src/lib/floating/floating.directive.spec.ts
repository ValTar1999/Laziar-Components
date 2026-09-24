import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { attachLzFloating } from './floating';
import { LzFloating } from './floating.directive';

function waitUntil(read: () => boolean): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = (): void => {
      if (read()) {
        resolve();
        return;
      }
      if (Date.now() - start > 1000) {
        reject(new Error('floating panel was not positioned'));
        return;
      }
      setTimeout(tick, 16);
    };
    tick();
  });
}

describe('attachLzFloating', () => {
  let anchor: HTMLButtonElement;
  let floating: HTMLDivElement;

  beforeEach(() => {
    anchor = document.createElement('button');
    Object.assign(anchor.style, {
      position: 'fixed',
      top: '80px',
      left: '80px',
      width: '120px',
      height: '32px',
    });
    floating = document.createElement('div');
    floating.textContent = 'menu';
    Object.assign(floating.style, {
      height: '40px',
    });
    document.body.append(anchor, floating);
  });

  afterEach(() => {
    anchor.remove();
    floating.remove();
  });

  it('pins a fixed panel under the anchor and rounds coordinates', async () => {
    const stop = attachLzFloating(anchor, floating, {
      placement: 'bottom-start',
      offset: 8,
      shiftPadding: 12,
      strategy: 'fixed',
    });

    await waitUntil(() => floating.style.top !== '');

    const top = Number.parseFloat(floating.style.top);
    const left = Number.parseFloat(floating.style.left);
    expect(floating.style.position).toBe('fixed');
    expect(Number.isInteger(top)).toBeTrue();
    expect(Number.isInteger(left)).toBeTrue();
    expect(top).toBeGreaterThanOrEqual(80);
    stop();
  });

  it('keeps list menus at least as wide as the anchor and caps their height', async () => {
    const stop = attachLzFloating(anchor, floating, {
      placement: 'bottom-start',
      offset: 8,
      shiftPadding: 8,
      flipPadding: 8,
      round: false,
      minWidth: 160,
      maxHeight: 208,
      sizePadding: 8,
    });

    await waitUntil(() => floating.style.minWidth !== '' && floating.style.maxHeight !== '');

    expect(Number.parseFloat(floating.style.minWidth)).toBeGreaterThanOrEqual(160);
    expect(Number.parseFloat(floating.style.maxHeight)).toBeLessThanOrEqual(208);
    stop();
  });

  it('stretches the panel to the anchor width', async () => {
    const stop = attachLzFloating(anchor, floating, {
      placement: 'bottom',
      matchWidth: true,
    });

    await waitUntil(() => floating.style.width !== '');

    expect(Number.parseFloat(floating.style.width)).toBeCloseTo(
      anchor.getBoundingClientRect().width,
      0,
    );
    stop();
  });
});

@Component({
  standalone: true,
  imports: [LzFloating],
  template: `
    <button #anchor type="button" class="lz-float-anchor">Open</button>
    <div
      class="lz-float-panel"
      lzFloating
      [lzFloating]="anchor"
      lzFloatingPlacement="bottom-end"
      [lzFloatingOffset]="10"
      [lzFloatingShiftPadding]="12"
    >
      Menu
    </div>
  `,
})
class FloatingHost {}

describe('LzFloating', () => {
  let fixture: ComponentFixture<FloatingHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingHost],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('writes a fixed position onto the host once layout is ready', async () => {
    const panel = fixture.nativeElement.querySelector('.lz-float-panel') as HTMLElement;
    await waitUntil(() => panel.style.visibility === 'visible' && panel.style.top !== '');
    expect(panel.style.position).toBe('fixed');
    expect(panel.style.visibility).toBe('visible');
    expect(Number.isInteger(Number.parseFloat(panel.style.top))).toBeTrue();
    expect(Number.isInteger(Number.parseFloat(panel.style.left))).toBeTrue();
  });
});
