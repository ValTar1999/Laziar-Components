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

  it('should work with reactive forms', () => {
    const control = new FormControl('initial');

    component.registerOnChange((value) => control.setValue(value));
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
