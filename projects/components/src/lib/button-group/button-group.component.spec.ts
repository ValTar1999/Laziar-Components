import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroup } from './button-group.component';

describe('ButtonGroup', () => {
  let component: ButtonGroup;
  let fixture: ComponentFixture<ButtonGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply divided class when line is true', () => {
    fixture.componentRef.setInput('line', true);
    fixture.detectChanges();

    const containerClass = component['containerClass']();
    expect(containerClass).toContain('lz-button-group--divided');
  });

  it('should apply divided class when divided is true', () => {
    fixture.componentRef.setInput('divided', true);
    fixture.detectChanges();

    const containerClass = component['containerClass']();
    expect(containerClass).toContain('lz-button-group--divided');
  });

  it('should not apply divided class when line and divided are false', () => {
    fixture.componentRef.setInput('line', false);
    fixture.componentRef.setInput('divided', false);
    fixture.detectChanges();

    const containerClass = component['containerClass']();
    expect(containerClass).not.toContain('lz-button-group--divided');
  });
});
