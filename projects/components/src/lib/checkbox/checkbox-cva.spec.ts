import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from './checkbox.component';

/** Host that binds lz-checkbox the way a consuming app's reactive form does. */
@Component({
  standalone: true,
  imports: [Checkbox, ReactiveFormsModule],
  template: `<lz-checkbox [formControl]="control" title="Accept" />`,
})
class HostComponent {
  readonly control = new FormControl<boolean>(false, { nonNullable: true });
}

describe('Checkbox ControlValueAccessor', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should render the control value (form -> component)', () => {
    expect(nativeInput().checked).toBe(false);

    host.control.setValue(true);
    fixture.detectChanges();
    expect(nativeInput().checked).toBe(true);

    host.control.setValue(false);
    fixture.detectChanges();
    expect(nativeInput().checked).toBe(false);
  });

  it('should update the control when clicked (component -> form)', () => {
    const input = nativeInput();
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(host.control.value).toBe(true);
  });

  it('should mark the control touched on interaction', () => {
    expect(host.control.touched).toBe(false);

    const input = nativeInput();
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(host.control.touched).toBe(true);
  });

  it('should reflect a disabled control', () => {
    expect(nativeInput().disabled).toBe(false);

    host.control.disable();
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(true);

    host.control.enable();
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(false);
  });

  it('should still emit checkedChange so declarative consumers are unregressed', () => {
    const emitted: boolean[] = [];
    const debugEl = fixture.debugElement.children[0];
    (debugEl.componentInstance as Checkbox).checkedChange.subscribe((v: boolean) =>
      emitted.push(v),
    );

    const input = nativeInput();
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });
});

/** Declarative host — no form — proving the original API still drives the component. */
@Component({
  standalone: true,
  imports: [Checkbox],
  template: `<lz-checkbox [checked]="checked" [disabled]="disabled" />`,
})
class DeclarativeHostComponent {
  checked = false;
  disabled = false;
}

describe('Checkbox declarative usage (unregressed)', () => {
  let fixture: ComponentFixture<DeclarativeHostComponent>;
  let host: DeclarativeHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarativeHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DeclarativeHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should follow the checked input', () => {
    expect(nativeInput().checked).toBe(false);

    host.checked = true;
    fixture.detectChanges();
    expect(nativeInput().checked).toBe(true);
  });

  it('should keep the interaction when the parent does not feed it back', () => {
    const input = nativeInput();
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // The parent ignored (checkedChange); the control stays where the user put
    // it rather than snapping back, matching how a native checkbox behaves.
    expect(nativeInput().checked).toBe(true);
  });

  it('should re-seed from the input when the input value actually changes', () => {
    const input = nativeInput();
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    host.checked = true;
    fixture.detectChanges();
    host.checked = false;
    fixture.detectChanges();

    expect(nativeInput().checked).toBe(false);
  });

  it('should follow the disabled input independently of any form', () => {
    host.disabled = true;
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(true);
  });
});
