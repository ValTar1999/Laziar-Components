import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingState } from './loading-state.component';

describe('LoadingState', () => {
  let fixture: ComponentFixture<LoadingState>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadingState] }).compileComponents();
    fixture = TestBed.createComponent(LoadingState);
    host = fixture.nativeElement as HTMLElement;
  });

  it('announces the label as a status', () => {
    fixture.componentRef.setInput('label', 'Se încarcă short-urile...');
    fixture.detectChanges();

    const status = host.querySelector('[role="status"]');
    expect(status?.textContent?.trim()).toBe('Se încarcă short-urile...');
  });

  it('shows a small spinner, hidden from assistive tech', () => {
    fixture.detectChanges();

    const spinner = host.querySelector('lz-loading');
    expect(spinner?.getAttribute('aria-hidden')).toBe('true');
    expect(host.querySelector('.lz-loading')?.getAttribute('data-size')).toBe('sm');
  });

  it('leaves out the label when there is none', () => {
    fixture.detectChanges();

    expect(host.querySelector('.lz-loading-state__label')).toBeNull();
  });
});
