import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox.component';

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.type()).toBe('checkbox');
    expect(component.rounded()).toBe(false);
    expect(component.checked()).toBe(false);
    expect(component.disabled()).toBe(false);
    expect(component.indeterminate()).toBe(false);
    expect(component.variant()).toBe('default');
    expect(component.title()).toBe('');
    expect(component.description()).toBe('');
  });

  it('should round radio even without rounded flag', () => {
    fixture.componentRef.setInput('type', 'radio');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('label');
    const input = fixture.nativeElement.querySelector('input');

    expect(wrapper.className).toContain('lz-checkbox__wrapper--rounded');
    expect(input.className).toContain('lz-checkbox__input--rounded');
  });

  it('should emit checkedChange when input changes', () => {
    spyOn(component.checkedChange, 'emit');

    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.checked = true;
    inputElement.dispatchEvent(new Event('change'));

    expect(component.checkedChange.emit).toHaveBeenCalledWith(true);
  });

  it('should apply correct CSS classes', () => {
    fixture.componentRef.setInput('rounded', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('label');
    const input = fixture.nativeElement.querySelector('input');

    expect(wrapper.className).toContain('lz-checkbox__wrapper--rounded');
    expect(wrapper.className).toContain('lz-checkbox__wrapper--disabled');
    expect(input.className).toContain('lz-checkbox__input--rounded');
    expect(input.className).toContain('lz-checkbox__input--disabled');
    expect(input.className).toContain('lz-checkbox__input--error');
  });
});
