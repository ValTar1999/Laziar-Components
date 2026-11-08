import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit value changes', () => {
    spyOn(component.valueChange, 'emit');

    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.valueChange.emit).toHaveBeenCalledWith('test');
  });

  it('should show clear button for search input with value', () => {
    fixture.componentRef.setInput('type', 'search');
    component.writeValue('search term');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lz-input-clear')).toBeTruthy();
  });

  it('should clear value when clear button is clicked', () => {
    spyOn(component.valueChange, 'emit');
    fixture.componentRef.setInput('type', 'search');
    component.writeValue('search term');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.lz-input-clear-button').click();
    fixture.detectChanges();

    expect(component.valueChange.emit).toHaveBeenCalledWith('');
    expect(fixture.nativeElement.querySelector('input').value).toBe('');
  });

  it('names the search clear button and hides its icon from assistive tech', () => {
    fixture.componentRef.setInput('type', 'search');
    component.writeValue('licee');
    fixture.detectChanges();

    const clear = fixture.nativeElement.querySelector('.lz-input-clear-button') as HTMLElement;
    expect(clear.getAttribute('aria-label')).toBe('Clear search');
    expect(clear.querySelector('lz-icon')?.getAttribute('aria-hidden')).toBe('true');

    fixture.componentRef.setInput('clearSearchLabel', 'Șterge căutarea');
    fixture.detectChanges();
    expect(clear.getAttribute('aria-label')).toBe('Șterge căutarea');
  });

  describe('onlyNumbers', () => {
    function type(value: string): HTMLInputElement {
      const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      el.value = value;
      el.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      return el;
    }

    it('keeps only digits in the field, the model and valueChange', () => {
      const changes: string[] = [];
      component.valueChange.subscribe((v) => changes.push(v));
      const modelChanges: string[] = [];
      component.registerOnChange((v) => modelChanges.push(v as string));
      fixture.componentRef.setInput('onlyNumbers', true);
      fixture.detectChanges();

      const el = type('12a3-4 b');

      expect(el.value).toBe('1234');
      expect(changes).toEqual(['1234']);
      expect(modelChanges).toEqual(['1234']);
    });

    it('asks mobile keyboards for digits', () => {
      fixture.componentRef.setInput('onlyNumbers', true);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;

      expect(el.getAttribute('inputmode')).toBe('numeric');
      expect(el.getAttribute('pattern')).toBe('[0-9]*');
    });

    it('leaves other characters alone by default', () => {
      const el = type('12a3');

      expect(el.value).toBe('12a3');
      expect(el.getAttribute('inputmode')).toBeNull();
    });
  });

  it('should work with reactive forms', () => {
    const control = new FormControl('initial');

    component.registerOnChange((value) => control.setValue(value as string));
    component.registerOnTouched(() => control.markAsTouched());

    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    inputElement.value = 'new value';
    inputElement.dispatchEvent(new Event('input'));

    expect(control.value).toBe('new value');
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });

  it('should respect CVA setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });

  it('should display error state correctly', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('data-error')).toBe('true');
  });

  it('should display helper text', () => {
    const helperText = 'This is helper text';
    fixture.componentRef.setInput('helperText', helperText);
    fixture.detectChanges();

    const helperElement = fixture.debugElement.nativeElement.querySelector('.lz-input-helper');
    expect(helperElement.textContent).toContain(helperText);
  });

  it('should show error icon with helper text', () => {
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('helperText', 'Required');
    fixture.detectChanges();

    const helper = fixture.nativeElement.querySelector('.lz-input-helper');
    expect(helper.getAttribute('data-error')).toBe('true');
    expect(helper.querySelector('.lz-input-helper-icon')).toBeTruthy();
  });

  it('should display label', () => {
    const label = 'Input Label';
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();

    const labelElement = fixture.debugElement.nativeElement.querySelector('.lz-input-label');
    expect(labelElement.textContent.trim()).toBe(label);
  });

  it('should handle different sizes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('data-size')).toBe('sm');
  });

  it('should join a leading addon into the field', () => {
    fixture.componentRef.setInput('withButton', 'left');
    fixture.componentRef.setInput('buttonLabel', 'Button');
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();

    const field = fixture.nativeElement.querySelector('input');
    const addon = fixture.nativeElement.querySelector('.lz-input-addon');
    expect(addon).toBeTruthy();
    expect(addon.getAttribute('data-side')).toBe('left');
    expect(addon.textContent.trim()).toBe('Button');
    expect(field.getAttribute('data-has-button-left')).toBe('true');
  });

  it('should keep field and trailing addon as separate focus targets', () => {
    fixture.componentRef.setInput('withButton', 'right');
    fixture.componentRef.setInput('buttonLabel', 'Button');
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();

    const field = fixture.nativeElement.querySelector('input');
    const addon = fixture.nativeElement.querySelector('.lz-input-addon');
    expect(addon.getAttribute('data-side')).toBe('right');
    expect(field.getAttribute('data-has-button-right')).toBe('true');
    expect(addon.tabIndex).not.toBe(-1);
  });

  it('should use mini icons for search', () => {
    fixture.componentRef.setInput('type', 'search');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.lz-input-search-icon');
    expect(icon.getAttribute('data-type')).toBe('mini');
  });
});

describe('InputComponent number type', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  const field = (): HTMLInputElement => fixture.nativeElement.querySelector('input');
  const type = (text: string): void => {
    field().value = text;
    field().dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();
  });

  it('renders a native number field with its bounds', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('step', 5);
    fixture.detectChanges();

    expect(field().type).toBe('number');
    expect([field().min, field().max, field().step]).toEqual(['0', '100', '5']);
  });

  it('leaves the bounds off any other type', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.componentRef.setInput('min', 0);
    fixture.detectChanges();

    expect(field().hasAttribute('min')).toBe(false);
  });

  it('hands a form control the number typed, and null when the field is empty', () => {
    const values: unknown[] = [];
    component.registerOnChange((value) => values.push(value));

    type('42');
    type('3.5');
    type('');

    expect(values).toEqual([42, 3.5, null]);
  });

  it('still emits the text through valueChange', () => {
    const emitted: string[] = [];
    component.valueChange.subscribe((value) => emitted.push(value));

    type('7');

    expect(emitted).toEqual(['7']);
  });

  it('shows a number written by the form', () => {
    component.writeValue(250);
    fixture.detectChanges();

    expect(field().value).toBe('250');
  });

  it('round-trips through a reactive FormControl', () => {
    const control = new FormControl<number | null>(3);
    component.registerOnChange((value) => control.setValue(value as number | null));
    component.writeValue(control.value);
    fixture.detectChanges();
    expect(field().value).toBe('3');

    type('12');

    expect(control.value).toBe(12);
  });
});

describe('InputComponent text-entry hints', () => {
  let fixture: ComponentFixture<InputComponent>;
  const field = (): HTMLInputElement => fixture.nativeElement.querySelector('input');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputComponent);
    fixture.detectChanges();
  });

  it('sets none of them unless asked', () => {
    expect(field().hasAttribute('spellcheck')).toBe(false);
    expect(field().hasAttribute('autocorrect')).toBe(false);
    expect(field().hasAttribute('autocapitalize')).toBe(false);
  });

  it('turns spellcheck, autocorrect and autocapitalize off for a name search', () => {
    fixture.componentRef.setInput('spellcheck', false);
    fixture.componentRef.setInput('autocorrect', 'off');
    fixture.componentRef.setInput('autocapitalize', 'off');
    fixture.detectChanges();

    expect(field().getAttribute('spellcheck')).toBe('false');
    expect(field().getAttribute('autocorrect')).toBe('off');
    expect(field().getAttribute('autocapitalize')).toBe('off');
  });
});

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `<lz-input label="Email" />`,
})
class InputFirstPaintHost {}

describe('InputComponent first paint (template-bound inputs)', () => {
  it('renders the label after a macrotask without a click', fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFirstPaintHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputFirstPaintHost);
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('.lz-input-label')?.textContent.trim()).toBe(
      'Email',
    );
  }));
});
