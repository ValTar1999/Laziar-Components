import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainer } from './toast-container.component';
import { ToastService } from './toast.service';

describe('ToastContainer', () => {
  let fixture: ComponentFixture<ToastContainer>;
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainer);
    service = TestBed.inject(ToastService);
  });

  function closeButton(): HTMLButtonElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '.lz-toast-notification__close button',
    );
  }

  it('renders the toasts the service holds', () => {
    service.show({ message: 'Salvat', duration: 0 });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Salvat');
  });

  it('names the close button in English by default', () => {
    service.show({ message: 'Saved', duration: 0 });
    fixture.detectChanges();

    expect(closeButton()?.getAttribute('aria-label')).toBe('Dismiss notification');
  });

  it('passes a localized close label to every toast', () => {
    fixture.componentRef.setInput('closeLabel', 'Închide notificarea');
    service.show({ message: 'Salvat', duration: 0 });
    fixture.detectChanges();

    expect(closeButton()?.getAttribute('aria-label')).toBe('Închide notificarea');
  });

  it('removes a toast when its close button is clicked', () => {
    service.show({ message: 'Salvat', duration: 0 });
    fixture.detectChanges();

    closeButton()?.click();
    fixture.detectChanges();

    expect(service.getToasts().length).toBe(0);
  });
});
