import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Calendar } from '../calendar/calendar.component';
import { Checkbox } from '../checkbox/checkbox.component';
import { DateInput } from '../date-input/date-input.component';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';

/**
 * One rule for every form control in the library: a control becomes touched
 * when the user leaves it, not while they are still working in it. A required
 * error that shows on the first keystroke, or never shows after tabbing
 * through, both come from breaking that rule.
 */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, Calendar, Checkbox, DateInput, InputComponent, SelectComponent],
  template: `
    <lz-input label="Name" [formControl]="text" />
    <lz-input label="Amount" type="number" [formControl]="amount" />
    <lz-select label="Country" [options]="countries" [formControl]="country" />
    <lz-date-input label="From" [formControl]="from" />
    <lz-checkbox title="Agree" [formControl]="agree" />
    <lz-calendar [formControl]="day" />
  `,
})
class FormHost {
  readonly countries = ['Moldova', 'Romania'];
  readonly text = new FormControl('');
  readonly amount = new FormControl<number | null>(5);
  readonly country = new FormControl<string | null>(null);
  readonly from = new FormControl<string | null>(null);
  readonly agree = new FormControl(false);
  readonly day = new FormControl<Date | null>(new Date(2026, 10, 12));
}

describe('Form controls: touched and typing', () => {
  let fixture: ComponentFixture<FormHost>;
  let host: FormHost;
  let overlay: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormHost] }).compileComponents();
    fixture = TestBed.createComponent(FormHost);
    host = fixture.componentInstance;
    overlay = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlay.ngOnDestroy();
    fixture.destroy();
  });

  const query = <T extends HTMLElement>(selector: string): T =>
    (fixture.nativeElement as HTMLElement).querySelector<T>(selector)!;
  const escape = () =>
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));

  describe('lz-input', () => {
    const field = () => query<HTMLInputElement>('lz-input input[type="text"]');

    it('is not touched by typing, only by leaving the field', () => {
      field().value = 'A';
      field().dispatchEvent(new Event('input'));
      expect(host.text.value).toBe('A');
      expect(host.text.touched).toBeFalse();

      field().dispatchEvent(new Event('blur'));
      expect(host.text.touched).toBeTrue();
    });

    it('does not erase a number that is still being typed', () => {
      const amount = query<HTMLInputElement>('lz-input input[type="number"]');
      expect(amount.value).toBe('5');

      // What the browser reports after the user replaces "5" with "-": the
      // field shows the minus, but its value is '' and it is flagged as bad input.
      const typed = { value: '', validity: { badInput: true }, valueAsNumber: NaN };
      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: typed });
      amount.dispatchEvent(event);
      fixture.detectChanges();

      // The form sees "no number", and nothing is written back over the field.
      expect(host.amount.value).toBeNull();
      expect(amount.value).toBe('5');
    });
  });

  describe('lz-select', () => {
    const trigger = () => query<HTMLButtonElement>('.lz-select-trigger');

    it('is touched when focus leaves the closed field', () => {
      trigger().dispatchEvent(new Event('blur'));
      expect(host.country.touched).toBeTrue();
    });

    it('is not touched by opening the list, and is once it is dismissed', () => {
      trigger().click();
      fixture.detectChanges();
      trigger().dispatchEvent(new Event('blur'));
      expect(host.country.touched).toBeFalse();

      escape();
      expect(host.country.touched).toBeTrue();
    });
  });

  describe('lz-date-input', () => {
    const trigger = () => query<HTMLButtonElement>('.lz-date-input__trigger');

    it('is touched when focus leaves the closed field', () => {
      trigger().dispatchEvent(new Event('blur'));
      expect(host.from.touched).toBeTrue();
    });

    it('is not touched by opening the calendar, and is once it is dismissed', () => {
      trigger().click();
      fixture.detectChanges();
      trigger().dispatchEvent(new Event('blur'));
      expect(host.from.touched).toBeFalse();

      escape();
      expect(host.from.touched).toBeTrue();
    });
  });

  it('lz-checkbox is touched by tabbing past it without changing it', () => {
    query<HTMLInputElement>('lz-checkbox input').dispatchEvent(new Event('blur'));
    expect(host.agree.touched).toBeTrue();
  });

  describe('lz-calendar', () => {
    const day = (key: string) => query<HTMLButtonElement>(`lz-calendar [data-key="${key}"]`);
    const leave = (from: HTMLElement, to: EventTarget | null) =>
      from.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: to }));

    it('is not touched by moving between days', () => {
      leave(day('2026-11-12'), day('2026-11-13'));
      expect(host.day.touched).toBeFalse();
    });

    it('is touched when focus leaves the grid', () => {
      leave(day('2026-11-12'), document.body);
      expect(host.day.touched).toBeTrue();
    });
  });
});
