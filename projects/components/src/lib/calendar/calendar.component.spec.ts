import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Calendar } from './calendar.component';

@Component({
  standalone: true,
  imports: [Calendar],
  template: `<lz-calendar
    [value]="value"
    [min]="min"
    [max]="max"
    (valueChange)="picked = $event"
  />`,
})
class HostComponent {
  value: Date | null = new Date(2026, 7, 29);
  min: Date | null = null;
  max: Date | null = null;
  picked: Date | null = null;
}

describe('Calendar', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const el = (): HTMLElement => fixture.nativeElement;
  const day = (key: string): HTMLButtonElement => el().querySelector(`[data-key="${key}"]`)!;
  const navButtons = (): HTMLButtonElement[] =>
    Array.from(el().querySelectorAll<HTMLButtonElement>('.lz-calendar__nav'));

  it('should render the month title and Romanian weekdays starting on Monday', () => {
    expect(el().querySelector('.lz-calendar__title')!.textContent!.trim()).toBe('August 2026');
    const weekdays = Array.from(el().querySelectorAll('.lz-calendar__weekday abbr')).map((n) =>
      n.textContent!.trim(),
    );
    expect(weekdays).toEqual(['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du']);
  });

  it('should render whole weeks with leading and trailing days', () => {
    // 1 Aug 2026 is a Saturday; 31 Aug a Monday → 6 rows from 27 Jul to 6 Sep.
    expect(el().querySelectorAll('tbody tr').length).toBe(6);
    expect(day('2026-07-27')).toBeTruthy();
    expect(day('2026-09-06')).toBeTruthy();
  });

  it('should mark the selected day', () => {
    expect(day('2026-08-29').classList).toContain('lz-calendar__day--selected');
    expect(day('2026-08-29').tabIndex).toBe(0);
  });

  it('should emit and select a clicked day', () => {
    day('2026-08-12').click();
    fixture.detectChanges();

    expect(host.picked).toEqual(new Date(2026, 7, 12));
    expect(day('2026-08-12').classList).toContain('lz-calendar__day--selected');
  });

  it('should move to the next month when a trailing day is picked', () => {
    day('2026-09-02').click();
    fixture.detectChanges();

    expect(el().querySelector('.lz-calendar__title')!.textContent!.trim()).toBe('Septembrie 2026');
  });

  it('should disable days outside min and hide the previous arrow', () => {
    host.min = new Date(2026, 7, 29);
    fixture.detectChanges();

    expect(day('2026-08-28').disabled).toBe(true);
    expect(day('2026-08-30').disabled).toBe(false);
    expect(navButtons()[0].classList).toContain('lz-calendar__nav--hidden');

    day('2026-08-28').click();
    expect(host.picked).toBeNull();
  });

  it('should page months with the arrows', () => {
    navButtons()[1].click();
    fixture.detectChanges();
    expect(el().querySelector('.lz-calendar__title')!.textContent!.trim()).toBe('Septembrie 2026');

    navButtons()[0].click();
    navButtons()[0].click();
    fixture.detectChanges();
    expect(el().querySelector('.lz-calendar__title')!.textContent!.trim()).toBe('Iulie 2026');
  });

  it('should move the tab stop with arrow keys across months', () => {
    const grid = day('2026-08-29');
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(el().querySelector('.lz-calendar__title')!.textContent!.trim()).toBe('Septembrie 2026');
    expect(day('2026-09-05').tabIndex).toBe(0);
  });
});

@Component({
  standalone: true,
  imports: [Calendar, ReactiveFormsModule],
  template: `<lz-calendar [formControl]="control" />`,
})
class FormHostComponent {
  readonly control = new FormControl<Date | null>(new Date(2025, 9, 15));
}

describe('Calendar ControlValueAccessor', () => {
  let fixture: ComponentFixture<FormHostComponent>;
  let host: FormHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(FormHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const day = (key: string): HTMLButtonElement =>
    fixture.nativeElement.querySelector(`[data-key="${key}"]`);

  it('should show the control value and follow its changes', () => {
    expect(day('2025-10-15').classList).toContain('lz-calendar__day--selected');

    host.control.setValue(new Date(2026, 0, 3));
    fixture.detectChanges();
    expect(day('2026-01-03').classList).toContain('lz-calendar__day--selected');
  });

  it('should write the picked day back and mark touched', () => {
    day('2025-10-20').click();
    fixture.detectChanges();

    expect(host.control.value).toEqual(new Date(2025, 9, 20));
    expect(host.control.touched).toBe(true);
  });

  it('should disable every day when the control is disabled', () => {
    host.control.disable();
    fixture.detectChanges();

    expect(day('2025-10-20').disabled).toBe(true);
  });
});

@Component({
  standalone: true,
  imports: [Calendar],
  template: `<lz-calendar
    withTime
    [withActions]="withActions"
    [value]="value"
    [min]="min"
    (valueChange)="emitted.push($event)"
    (cancelled)="cancelled = cancelled + 1"
  />`,
})
class TimeHostComponent {
  value: Date | null = new Date(2025, 9, 15, 15, 0);
  min: Date | null = null;
  withActions = true;
  emitted: Date[] = [];
  cancelled = 0;
}

describe('Calendar with time and actions', () => {
  let fixture: ComponentFixture<TimeHostComponent>;
  let host: TimeHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TimeHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TimeHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  const el = (): HTMLElement => fixture.nativeElement;
  const day = (key: string): HTMLButtonElement => el().querySelector(`[data-key="${key}"]`)!;
  const fields = (): HTMLInputElement[] =>
    Array.from(el().querySelectorAll<HTMLInputElement>('.lz-calendar__fields input'));
  const actionButtons = (): HTMLButtonElement[] =>
    Array.from(el().querySelectorAll<HTMLButtonElement>('.lz-calendar__actions button'));

  async function type(field: HTMLInputElement, text: string): Promise<void> {
    field.value = text;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    field.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should show the value in the date and time fields', () => {
    expect(fields().map((f) => f.value)).toEqual(['15.10.2025', '15:00']);
  });

  it('should keep picks as a draft until save', async () => {
    day('2025-10-20').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.emitted).toEqual([]);
    expect(fields()[0].value).toBe('20.10.2025');

    await type(fields()[1], '9:30');
    actionButtons()[1].click();
    fixture.detectChanges();

    expect(host.emitted).toEqual([new Date(2025, 9, 20, 9, 30)]);
  });

  it('should restore the last value on cancel', async () => {
    day('2025-10-20').click();
    await type(fields()[1], '09:30');

    actionButtons()[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.cancelled).toBe(1);
    expect(host.emitted).toEqual([]);
    expect(day('2025-10-15').classList).toContain('lz-calendar__day--selected');
    expect(fields().map((f) => f.value)).toEqual(['15.10.2025', '15:00']);
  });

  it('should jump the grid to a typed date', async () => {
    await type(fields()[0], '3.1.2026');

    expect(el().querySelector('.lz-calendar__title')!.textContent!.trim()).toBe('Ianuarie 2026');
    expect(day('2026-01-03').classList).toContain('lz-calendar__day--selected');
    expect(fields()[0].value).toBe('03.01.2026');
  });

  it('should revert invalid or out-of-range text', async () => {
    host.min = new Date(2025, 9, 10);
    fixture.detectChanges();

    await type(fields()[0], '31.02.2026');
    expect(fields()[0].value).toBe('15.10.2025');

    await type(fields()[0], '01.10.2025');
    expect(fields()[0].value).toBe('15.10.2025');

    await type(fields()[1], '25:00');
    expect(fields()[1].value).toBe('15:00');
  });

  it('should emit straight away without actions, keeping the time', async () => {
    host.withActions = false;
    fixture.detectChanges();

    day('2025-10-21').click();
    fixture.detectChanges();

    expect(host.emitted).toEqual([new Date(2025, 9, 21, 15, 0)]);
    expect(el().querySelector('.lz-calendar__actions')).toBeNull();
  });
});
