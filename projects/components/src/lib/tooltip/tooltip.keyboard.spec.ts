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

@Component({
  standalone: true,
  imports: [Tooltip],
  template: `
    <lz-tooltip [text]="text" class="icon-only">
      <button type="button"><svg aria-hidden="true"></svg></button>
    </lz-tooltip>
    <lz-tooltip text="Bold" class="named">
      <button type="button" aria-label="Make the text bold"><svg aria-hidden="true"></svg></button>
    </lz-tooltip>
    <lz-tooltip text="Formatting" class="group">
      <button type="button"><svg aria-hidden="true"></svg></button>
      <button type="button"><svg aria-hidden="true"></svg></button>
    </lz-tooltip>
  `,
})
class NamingHost {
  text = 'Delete';
}

describe('Tooltip as the name of an icon-only control', () => {
  let fixture: ComponentFixture<NamingHost>;
  let overlay: OverlayContainer;
  const button = (cls: string, index = 0): HTMLButtonElement =>
    fixture.nativeElement.querySelectorAll(`.${cls} button`)[index];

  beforeEach(() => {
    fixture = TestBed.createComponent(NamingHost);
    overlay = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    overlay.ngOnDestroy();
  });

  it('names a control that has no name, and follows the text', () => {
    expect(button('icon-only').getAttribute('aria-label')).toBe('Delete');

    fixture.componentInstance.text = 'Remove';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(button('icon-only').getAttribute('aria-label')).toBe('Remove');

    fixture.componentInstance.text = '';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(button('icon-only').hasAttribute('aria-label')).toBeFalse();
  });

  it('leaves a name the author gave, and does not guess between several controls', () => {
    expect(button('named').getAttribute('aria-label')).toBe('Make the text bold');
    expect(button('group', 0).hasAttribute('aria-label')).toBeFalse();
    expect(button('group', 1).hasAttribute('aria-label')).toBeFalse();
  });

  it('does not also describe the control with the text that is already its name', async () => {
    button('icon-only').dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await new Promise<void>((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    expect(overlay.getContainerElement().querySelector('.lz-tooltip__panel')).not.toBeNull();
    expect(button('icon-only').hasAttribute('aria-describedby')).toBeFalse();
  });
});

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
