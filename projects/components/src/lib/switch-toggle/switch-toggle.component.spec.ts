import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchToggle } from './switch-toggle.component';

describe('SwitchToggle', () => {
  let component: SwitchToggle;
  let fixture: ComponentFixture<SwitchToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.active()).toBe(false);
    expect(component.disabled()).toBe(false);
    expect(component.size()).toBe('md');
  });

  it('should emit changed when toggled and not disabled', () => {
    spyOn(component.changed, 'emit');
    fixture.componentRef.setInput('active', false);
    fixture.componentRef.setInput('disabled', false);

    component['toggle']();

    expect(component.changed.emit).toHaveBeenCalledWith(true);
  });

  it('should not emit changed when disabled', () => {
    spyOn(component.changed, 'emit');
    fixture.componentRef.setInput('disabled', true);

    component['toggle']();

    expect(component.changed.emit).not.toHaveBeenCalled();
  });

  it('should toggle from true to false', () => {
    spyOn(component.changed, 'emit');
    fixture.componentRef.setInput('active', true);
    fixture.componentRef.setInput('disabled', false);

    component['toggle']();

    expect(component.changed.emit).toHaveBeenCalledWith(false);
  });

  it('should apply correct CSS classes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('active', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');
    const toggle = fixture.nativeElement.querySelector('button');
    const circle = fixture.nativeElement.querySelector('span');

    expect(container.className).toContain('lz-switch-toggle__container--sm');
    expect(container.className).toContain('lz-switch-toggle__container--disabled');
    expect(toggle.className).toContain('lz-switch-toggle__toggle--sm');
    // publikator: disabled → inactive track even if active
    expect(toggle.className).toContain('lz-switch-toggle__toggle--inactive');
    expect(circle.className).toContain('lz-switch-toggle__circle--sm');
    expect(circle.className).toContain('lz-switch-toggle__circle--right');
  });
});
