import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioGroup } from './radio-group.component';
import { LzRadioOption } from './radio-group.types';

const OPTIONS: LzRadioOption<string>[] = [
  { value: 'evenly', label: 'Evenly', description: 'Spread over the flight', icon: 'play' },
  { value: 'fast', label: 'As fast as possible' },
  { value: 'off', label: 'Unavailable', disabled: true },
];

describe('RadioGroup', () => {
  let fixture: ComponentFixture<RadioGroup>;
  let component: RadioGroup;

  const radios = (): HTMLInputElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
  const group = (): HTMLElement => fixture.nativeElement.querySelector('[role="radiogroup"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RadioGroup] }).compileComponents();
    fixture = TestBed.createComponent(RadioGroup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.componentRef.setInput('ariaLabel', 'Delivery mode');
    fixture.detectChanges();
  });

  it('renders a named radiogroup of native radios sharing one name', () => {
    expect(group().getAttribute('aria-label')).toBe('Delivery mode');
    const names = radios().map((radio) => radio.name);
    expect(names.length).toBe(3);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).toMatch(/^lz-radio-group-/);
  });

  it('uses the given name and the visible heading when told to', () => {
    fixture.componentRef.setInput('name', 'delivery_mode');
    fixture.componentRef.setInput('ariaLabel', undefined);
    fixture.componentRef.setInput('ariaLabelledBy', 'delivery-heading');
    fixture.detectChanges();

    expect(radios()[0].name).toBe('delivery_mode');
    expect(group().getAttribute('aria-labelledby')).toBe('delivery-heading');
    expect(group().hasAttribute('aria-label')).toBe(false);
  });

  it('checks the option whose value it is given', () => {
    fixture.componentRef.setInput('value', 'fast');
    fixture.detectChanges();

    expect(radios().map((radio) => radio.checked)).toEqual([false, true, false]);
  });

  it('emits the chosen value and moves the check', () => {
    const emitted: unknown[] = [];
    component.valueChange.subscribe((value) => emitted.push(value));

    radios()[1].click();
    fixture.detectChanges();

    expect(emitted).toEqual(['fast']);
    expect(radios()[1].checked).toBe(true);
    expect(
      fixture.nativeElement
        .querySelectorAll('.lz-radio-group__option')[1]
        .getAttribute('data-checked'),
    ).toBe('true');
  });

  it('describes an option by its description and draws its icon', () => {
    const description = fixture.nativeElement.querySelector('.lz-radio-group__description');

    expect(radios()[0].getAttribute('aria-describedby')).toBe(description.id);
    expect(description.textContent.trim()).toBe('Spread over the flight');
    expect(radios()[1].hasAttribute('aria-describedby')).toBe(false);
    expect(fixture.nativeElement.querySelectorAll('.lz-radio-group__icon').length).toBe(1);
  });

  it('disables one option, or all of them', () => {
    expect(radios().map((radio) => radio.disabled)).toEqual([false, false, true]);

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(radios().every((radio) => radio.disabled)).toBe(true);
    expect(group().getAttribute('aria-disabled')).toBe('true');
  });

  it('draws options as cards when asked', () => {
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();

    expect(group().getAttribute('data-appearance')).toBe('card');
    expect(group().getAttribute('data-orientation')).toBe('horizontal');
  });

  describe('as a form control', () => {
    it('round-trips a reactive form value and its disabled state', () => {
      const control = new FormControl<string | null>('evenly');
      component.registerOnChange((value) => control.setValue(value as string));
      component.writeValue(control.value);
      fixture.detectChanges();
      expect(radios()[0].checked).toBe(true);

      radios()[1].click();
      expect(control.value).toBe('fast');

      component.setDisabledState(true);
      fixture.detectChanges();
      expect(radios().every((radio) => radio.disabled)).toBe(true);
    });

    it('works with ngModel', async () => {
      @Component({
        standalone: true,
        imports: [RadioGroup, FormsModule, ReactiveFormsModule],
        template: `<lz-radio-group [options]="options" ariaLabel="Mode" [(ngModel)]="mode" />`,
      })
      class Host {
        readonly options = OPTIONS;
        mode = 'fast';
      }

      const host = TestBed.createComponent(Host);
      host.detectChanges();
      await host.whenStable();
      host.detectChanges();

      const hostRadios = Array.from<HTMLInputElement>(
        host.nativeElement.querySelectorAll('input[type="radio"]'),
      );
      expect(hostRadios[1].checked).toBe(true);

      hostRadios[0].click();
      expect(host.componentInstance.mode).toBe('evenly');
    });
  });
});
