import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchToggle } from './switch-toggle.component';

/** Host that binds lz-switch-toggle the way a consuming app's reactive form does. */
@Component({
  standalone: true,
  imports: [SwitchToggle, ReactiveFormsModule],
  template: `<lz-switch-toggle [formControl]="control" />`,
})
class HostComponent {
  readonly control = new FormControl<boolean>(false, { nonNullable: true });
}

describe('SwitchToggle ControlValueAccessor', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function toggleButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[role="switch"]');
  }

  it('should render the control value (form -> component)', () => {
    expect(toggleButton().getAttribute('aria-checked')).toBe('false');

    host.control.setValue(true);
    fixture.detectChanges();
    expect(toggleButton().getAttribute('aria-checked')).toBe('true');
  });

  it('should update the control when toggled (component -> form)', () => {
    toggleButton().click();
    fixture.detectChanges();

    expect(host.control.value).toBe(true);
    expect(toggleButton().getAttribute('aria-checked')).toBe('true');
  });

  it('should toggle back off', () => {
    toggleButton().click();
    fixture.detectChanges();
    toggleButton().click();
    fixture.detectChanges();

    expect(host.control.value).toBe(false);
  });

  it('should mark the control touched on interaction', () => {
    expect(host.control.touched).toBe(false);

    toggleButton().click();
    fixture.detectChanges();

    expect(host.control.touched).toBe(true);
  });

  it('should reflect a disabled control and ignore clicks while disabled', () => {
    host.control.disable();
    fixture.detectChanges();
    expect(toggleButton().disabled).toBe(true);

    toggleButton().click();
    fixture.detectChanges();
    expect(host.control.value).toBe(false);

    host.control.enable();
    fixture.detectChanges();
    expect(toggleButton().disabled).toBe(false);
  });

  it('should still emit changed so declarative consumers are unregressed', () => {
    const emitted: boolean[] = [];
    const debugEl = fixture.debugElement.children[0];
    (debugEl.componentInstance as SwitchToggle).changed.subscribe((v: boolean) => emitted.push(v));

    toggleButton().click();
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });
});

/** Declarative host — no form — proving the original API still drives the component. */
@Component({
  standalone: true,
  imports: [SwitchToggle],
  template: `<lz-switch-toggle [active]="active" [disabled]="disabled" />`,
})
class DeclarativeHostComponent {
  active = false;
  disabled = false;
}

describe('SwitchToggle declarative usage (unregressed)', () => {
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

  function toggleButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[role="switch"]');
  }

  it('should follow the active input', () => {
    expect(toggleButton().getAttribute('aria-checked')).toBe('false');

    host.active = true;
    fixture.detectChanges();
    expect(toggleButton().getAttribute('aria-checked')).toBe('true');
  });

  it('should keep the interaction when the parent does not feed it back', () => {
    toggleButton().click();
    fixture.detectChanges();

    // The parent ignored (changed); the switch stays where the user put it.
    expect(toggleButton().getAttribute('aria-checked')).toBe('true');
  });

  it('should re-seed from the input when the input value actually changes', () => {
    toggleButton().click();
    fixture.detectChanges();

    host.active = true;
    fixture.detectChanges();
    host.active = false;
    fixture.detectChanges();

    expect(toggleButton().getAttribute('aria-checked')).toBe('false');
  });

  it('should follow the disabled input independently of any form', () => {
    host.disabled = true;
    fixture.detectChanges();
    expect(toggleButton().disabled).toBe(true);
  });
});
