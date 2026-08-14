import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaComponent, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit value changes', () => {
    spyOn(component.valueChange, 'emit');

    const textareaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    textareaElement.value = 'test content';
    textareaElement.dispatchEvent(new Event('input'));

    expect(component.valueChange.emit).toHaveBeenCalledWith('test content');
  });

  it('should work with reactive forms', () => {
    const control = new FormControl('initial content');

    component.registerOnChange((value) => control.setValue(value));
    component.registerOnTouched(() => control.markAsTouched());

    const textareaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    textareaElement.value = 'new content';
    textareaElement.dispatchEvent(new Event('input'));

    expect(control.value).toBe('new content');
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    expect(textareaElement.disabled).toBe(true);
  });

  it('should display error state correctly', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    expect(textareaElement.getAttribute('data-error')).toBe('true');
  });

  it('should display helper text', () => {
    const helperText = 'This is helper text';
    fixture.componentRef.setInput('helperText', helperText);
    fixture.detectChanges();

    const helperElement = fixture.debugElement.nativeElement.querySelector('.lz-textarea-helper');
    expect(helperElement.textContent).toContain(helperText);
  });

  it('should show error icon with helper text', () => {
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('helperText', 'Required');
    fixture.detectChanges();

    const helper = fixture.nativeElement.querySelector('.lz-textarea-helper');
    expect(helper.getAttribute('data-error')).toBe('true');
    expect(helper.querySelector('.lz-textarea-helper-icon')).toBeTruthy();
  });

  it('should display label', () => {
    const label = 'Textarea Label';
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();

    const labelElement = fixture.debugElement.nativeElement.querySelector('.lz-textarea-label');
    expect(labelElement.textContent.trim()).toBe(label);
  });

  it('should set correct number of rows', () => {
    fixture.componentRef.setInput('rows', 6);
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    expect(textareaElement.rows).toBe(6);
  });

  it('should handle resize option', () => {
    fixture.componentRef.setInput('resize', 'both');
    fixture.detectChanges();

    const textareaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    expect(textareaElement.getAttribute('data-resize')).toBe('both');
  });
});
