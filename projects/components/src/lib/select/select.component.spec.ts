import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectComponent } from './select.component';
import { LzSelectOptionType } from './select.types';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  const stringOptions = ['Option 1', 'Option 2', 'Option 3'];
  const objectOptions: LzSelectOptionType[] = [
    { id: 1, title: 'First Option', date: '2023-01-01' },
    { id: 2, title: 'Second Option', date: '2023-01-02' },
    { id: 3, title: 'Third Option', date: '2023-01-03' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render string options in the dropdown', () => {
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.lz-select-option');
    expect(options.length).toBe(3);
    expect(options[0].textContent).toContain('Option 1');
  });

  it('should render object option titles', () => {
    fixture.componentRef.setInput('options', objectOptions);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.lz-select-option');
    expect(options[0].textContent).toContain('First Option');
  });

  it('should toggle dropdown when clicked', () => {
    spyOn(component.opened, 'emit');

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lz-select-dropdown')).toBeTruthy();
    expect(component.opened.emit).toHaveBeenCalled();
  });

  it('should select option when clicked', () => {
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.lz-select-option');
    options[0].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lz-select-value').textContent.trim()).toBe(
      'Option 1',
    );
    expect(fixture.nativeElement.querySelector('.lz-select-dropdown')).toBeFalsy();
  });

  it('should work with reactive forms', () => {
    const control = new FormControl<string | null>(null);
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    component.registerOnChange((value) => control.setValue(value as string));
    component.registerOnTouched(() => control.markAsTouched());

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('.lz-select-option')[0].click();

    expect(control.value).toBe(stringOptions[0]);
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    expect(triggerButton.disabled).toBe(true);
    expect(triggerButton.getAttribute('data-disabled')).toBe('true');
  });

  it('should respect CVA setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    expect(triggerButton.disabled).toBe(true);
  });

  it('should display label', () => {
    const label = 'Select Label';
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('.lz-select-label');
    expect(labelElement.textContent.trim()).toBe(label);
  });

  it('should display helper text', () => {
    const helperText = 'This is helper text';
    fixture.componentRef.setInput('helperText', helperText);
    fixture.detectChanges();

    const helperElement = fixture.nativeElement.querySelector('.lz-select-helper');
    expect(helperElement.textContent.trim()).toBe(helperText);
  });

  it('should identify selected options in the UI', () => {
    fixture.componentRef.setInput('options', objectOptions);
    component.writeValue(objectOptions[0]);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const selected = fixture.nativeElement.querySelector('.lz-select-option[data-selected="true"]');
    expect(selected?.textContent).toContain('First Option');
  });

  it('should close dropdown when clicking outside', () => {
    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lz-select-dropdown')).toBeTruthy();

    document.body.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lz-select-dropdown')).toBeFalsy();
  });

  it('should handle different sizes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    expect(triggerButton.getAttribute('data-size')).toBe('sm');
  });
});
