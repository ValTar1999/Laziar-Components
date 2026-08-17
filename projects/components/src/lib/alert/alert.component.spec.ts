import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Alert } from './alert.component';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert],
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed event when close button is clicked', () => {
    spyOn(component['closed'], 'emit');

    component['onCloseClick']();

    expect(component['closed'].emit).toHaveBeenCalled();
  });

  it('should apply correct variant class', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    const alertClass = component['alertClass']();
    expect(alertClass).toContain('lz-alert--success');
  });

  it('should apply row class when isRow is true', () => {
    fixture.componentRef.setInput('isRow', true);
    fixture.detectChanges();

    const alertClass = component['alertClass']();
    expect(alertClass).toContain('lz-alert--row');
  });
});

@Component({
  standalone: true,
  imports: [Alert],
  template: `<lz-alert title="Saved" />`,
})
class AlertFirstPaintHost {}

describe('Alert first paint (template-bound inputs)', () => {
  it('renders the title after a macrotask without a click', fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertFirstPaintHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(AlertFirstPaintHost);
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('.lz-alert__title')?.textContent).toContain('Saved');
  }));
});
