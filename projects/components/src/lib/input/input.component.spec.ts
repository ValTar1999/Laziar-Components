import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    expect(helperElement.textContent.trim()).toBe(helperText);
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
});
