import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LzInputFlush } from './lz-input-flush.directive';

@Component({
  selector: 'lz-flush-probe',
  standalone: true,
  hostDirectives: [LzInputFlush],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (label()) {
    <span class="probe-label">{{ label() }}</span>
  }`,
})
class FlushProbe {
  readonly label = input('');
}

@Component({
  standalone: true,
  imports: [FlushProbe],
  template: `<lz-flush-probe label="Ready" />`,
})
class FlushProbeHost {}

describe('LzInputFlush', () => {
  it('paints template-bound signal inputs after a macrotask without a click', fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [FlushProbeHost],
    }).compileComponents();

    const fixture: ComponentFixture<FlushProbeHost> = TestBed.createComponent(FlushProbeHost);
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('.probe-label')?.textContent).toContain('Ready');
  }));
});
