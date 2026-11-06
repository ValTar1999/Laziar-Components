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

  const status = (): string | undefined =>
    host.querySelector('.lz-loading-state__announcement[role="status"]')?.textContent?.trim();

  /** Runs a full app render, so afterNextRender hooks fire and their update lands. */
  async function settle(): Promise<void> {
    fixture.autoDetectChanges();
    await fixture.whenStable();
  }

  it('fills the status region only after the first render', async () => {
    fixture.componentRef.setInput('label', 'Se încarcă short-urile...');
    fixture.detectChanges();
    const first = status();

    await settle();

    expect(first).toBe('');
    expect(status()).toBe('Se încarcă short-urile...');
  });

  it('hides the visible label from assistive tech so it is not read twice', async () => {
    fixture.componentRef.setInput('label', 'Se încarcă...');
    await settle();

    expect(host.querySelector('.lz-loading-state__label')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('announces srLabel when there is no visible label', async () => {
    await settle();
    expect(status()).toBe('Se încarcă...');

    fixture.componentRef.setInput('srLabel', 'Loading videos');
    fixture.detectChanges();
    expect(status()).toBe('Loading videos');
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
