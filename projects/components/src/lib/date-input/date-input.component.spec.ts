import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DateInput, lzParseIsoDate, lzToIsoDate } from './date-input.component';

@Component({
  standalone: true,
  imports: [DateInput, ReactiveFormsModule],
  template: `
    <lz-date-input
      label="Start date"
      [formControl]="control"
      [min]="min()"
      helperText="Whole days in the campaign's zone."
    />
  `,
})
class DateInputHost {
  readonly control = new FormControl<string | null>('2026-11-12');
  readonly min = signal<string | null>('2026-11-10');
}

describe('DateInput', () => {
  let fixture: ComponentFixture<DateInputHost>;
  let overlay: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DateInputHost] }).compileComponents();
    fixture = TestBed.createComponent(DateInputHost);
    overlay = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlay.ngOnDestroy();
    fixture.destroy();
  });

  const trigger = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.lz-date-input__trigger');
  const pane = (): HTMLElement => overlay.getContainerElement();
  const open = () => {
    trigger().click();
    fixture.detectChanges();
  };
  const dayButton = (key: string): HTMLButtonElement | null =>
    pane().querySelector<HTMLButtonElement>(`.lz-calendar__day[data-key="${key}"]`);

  it('converts between yyyy-mm-dd and local dates without shifting the day', () => {
    const date = lzParseIsoDate('2026-03-29')!;
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(29);
    expect(lzToIsoDate(date)).toBe('2026-03-29');
    expect(lzParseIsoDate('2026-02-30')).toBeNull();
    expect(lzParseIsoDate('29.03.2026')).toBeNull();
  });

  it('shows the form value as a day, labelled and described', () => {
    expect(trigger().textContent?.trim()).toBe('12/11/2026');
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.htmlFor).toBe(trigger().id);
    const helper = fixture.nativeElement.querySelector('.lz-date-input__helper') as HTMLElement;
    expect(trigger().getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('shows the placeholder when empty', () => {
    fixture.componentInstance.control.setValue(null);
    fixture.detectChanges();
    expect(trigger().textContent?.trim()).toBe('Select a date');
    expect(trigger().getAttribute('data-empty')).toBe('true');
  });

  it('opens the calendar as a dialog and focuses the chosen day', () => {
    open();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    const dialog = pane().querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toBeTruthy();
    expect(trigger().getAttribute('aria-controls')).toBe(dialog.id);
    expect(document.activeElement?.textContent?.trim()).toBe('12');
  });

  it('writes the picked day to the form as yyyy-mm-dd and closes', () => {
    open();
    dayButton('2026-11-20')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('2026-11-20');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(pane().querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('keeps days before min unselectable', () => {
    open();
    expect(dayButton('2026-11-09')?.disabled).toBeTrue();
    expect(dayButton('2026-11-10')?.disabled).toBeFalse();
  });

  it('closes on Escape and returns focus to the field', () => {
    open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger());
  });

  it('follows the form disabled state', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(trigger().disabled).toBeTrue();
    trigger().click();
    fixture.detectChanges();
    expect(pane().querySelector('[role="dialog"]')).toBeNull();
  });
});
