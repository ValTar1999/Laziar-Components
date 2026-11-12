import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Tooltip } from './tooltip.component';

@Component({
  standalone: true,
  imports: [Tooltip],
  template: `
    <lz-tooltip text="Copies the link">
      <button type="button" class="trigger">Copy</button>
    </lz-tooltip>
  `,
})
class TooltipHost {}

/** The panel is attached in a microtask after the tooltip is asked to show. */
const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('Tooltip with the keyboard', () => {
  let fixture: ComponentFixture<TooltipHost>;
  let overlay: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TooltipHost] }).compileComponents();
    fixture = TestBed.createComponent(TooltipHost);
    overlay = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    overlay.ngOnDestroy();
  });

  const trigger = (): HTMLButtonElement => fixture.nativeElement.querySelector('.trigger');
  const panel = (): HTMLElement | null =>
    overlay.getContainerElement().querySelector('.lz-tooltip__panel');
  const focusTrigger = async () => {
    trigger().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await settle();
  };

  it('opens when focus lands on the trigger and describes it', async () => {
    await focusTrigger();

    expect(panel()?.textContent).toContain('Copies the link');
    expect(panel()!.getAttribute('role')).toBe('tooltip');
    expect(trigger().getAttribute('aria-describedby')).toBe(panel()!.id);
  });

  it('closes when focus leaves and drops the description', async () => {
    await focusTrigger();

    trigger().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

    expect(panel()).toBeNull();
    expect(trigger().hasAttribute('aria-describedby')).toBeFalse();
  });

  it('closes on Escape and claims the key', async () => {
    await focusTrigger();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger().dispatchEvent(event);

    expect(panel()).toBeNull();
    expect(event.defaultPrevented).toBeTrue();
  });

  it('leaves Escape alone while closed', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger().dispatchEvent(event);

    expect(event.defaultPrevented).toBeFalse();
  });
});
