import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadError } from './load-error.component';

describe('LoadError', () => {
  let fixture: ComponentFixture<LoadError>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadError] }).compileComponents();
    fixture = TestBed.createComponent(LoadError);
    host = fixture.nativeElement as HTMLElement;
  });

  function render(inputs: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
  }

  it('renders an error alert with the heading and text', () => {
    render({ heading: 'Eroare la încărcarea știrilor', text: 'Încercați din nou.' });

    expect(host.querySelector('.lz-alert')?.getAttribute('data-variant')).toBe('error');
    expect(host.querySelector('.lz-alert__title')?.textContent?.trim()).toBe(
      'Eroare la încărcarea știrilor',
    );
    expect(host.querySelector('.lz-alert__text')?.textContent?.trim()).toBe('Încercați din nou.');
  });

  it('retries from its button, labelled "Reîncearcă" by default', () => {
    let retries = 0;
    fixture.componentInstance.retry.subscribe(() => retries++);
    render({ heading: 'Eroare' });

    const button = host.querySelector<HTMLButtonElement>('lz-button button')!;
    expect(button.textContent?.trim()).toBe('Reîncearcă');
    button.click();
    expect(retries).toBe(1);
  });

  it('has no close button and no retry button without a label', () => {
    render({ heading: 'Eroare', retryLabel: '' });

    expect(host.querySelector('lz-button')).toBeNull();
  });
});
