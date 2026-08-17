import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function panelEl(): HTMLElement | null {
    return host().querySelector('.lz-modal');
  }

  function backdropEl(): HTMLElement | null {
    return host().querySelector('.lz-modal-backdrop');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.open()).toBe(false);
    expect(component.size()).toBe('md');
    expect(component.dismissible()).toBe(true);
    expect(component.closeOnBackdrop()).toBe(true);
    expect(component.closeOnEscape()).toBe(true);
  });

  it('should render nothing while closed', () => {
    expect(panelEl()).toBeNull();
  });

  it('should render the panel when opened', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(panelEl()).not.toBeNull();
    expect(panelEl()?.getAttribute('role')).toBe('dialog');
    expect(panelEl()?.getAttribute('aria-modal')).toBe('true');
  });

  it('should apply the size modifier class', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(panelEl()?.classList).toContain('lz-modal--lg');
  });

  it('should label the dialog with the title when one is set', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Confirm');
    fixture.detectChanges();

    const labelledBy = panelEl()?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(host().querySelector(`#${labelledBy}`)?.textContent).toContain('Confirm');
  });

  it('should not set aria-labelledby without a title', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(panelEl()?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should emit closed with "close-button" when the dismiss button is clicked', () => {
    const reasons: string[] = [];
    component.closed.subscribe((r) => reasons.push(r));

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    host().querySelector<HTMLButtonElement>('.lz-modal__close')?.click();

    expect(reasons).toEqual(['close-button']);
  });

  it('should hide the dismiss button when not dismissible', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('dismissible', false);
    fixture.detectChanges();

    expect(host().querySelector('.lz-modal__close')).toBeNull();
  });

  it('should emit closed with "backdrop" only for a press that starts on the backdrop', () => {
    const reasons: string[] = [];
    component.closed.subscribe((r) => reasons.push(r));

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    // A press originating inside the panel must not dismiss.
    panelEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(reasons).toEqual([]);

    backdropEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(reasons).toEqual(['backdrop']);
  });

  it('should not emit on backdrop press when closeOnBackdrop is false', () => {
    const reasons: string[] = [];
    component.closed.subscribe((r) => reasons.push(r));

    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeOnBackdrop', false);
    fixture.detectChanges();

    backdropEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(reasons).toEqual([]);
  });

  it('should lock body scroll while open and release it on close', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(document.body.classList).toContain('lz-modal-scroll-lock');

    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    expect(document.body.classList).not.toContain('lz-modal-scroll-lock');
  });

  it('should keep the scroll lock while a second modal is still open', () => {
    const second = TestBed.createComponent(ModalComponent);
    second.detectChanges();

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    second.componentRef.setInput('open', true);
    second.detectChanges();
    expect(document.body.classList).toContain('lz-modal-scroll-lock');

    // Closing the inner modal must not unlock the page under the outer one.
    second.componentRef.setInput('open', false);
    second.detectChanges();
    expect(document.body.classList).toContain('lz-modal-scroll-lock');

    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    expect(document.body.classList).not.toContain('lz-modal-scroll-lock');

    second.destroy();
  });

  it('should use the close button label input', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeButtonLabel', 'Inchide');
    fixture.detectChanges();

    expect(host().querySelector('.lz-modal__close')?.getAttribute('aria-label')).toBe('Inchide');
  });

  it('should fall back to ariaLabel when a header slot replaces the title', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('ariaLabel', 'Payment dialog');
    fixture.detectChanges();

    expect(panelEl()?.getAttribute('aria-label')).toBe('Payment dialog');
    expect(panelEl()?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should prefer the title over ariaLabel for the accessible name', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Confirm');
    fixture.componentRef.setInput('ariaLabel', 'ignored');
    fixture.detectChanges();

    expect(panelEl()?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(panelEl()?.getAttribute('aria-label')).toBeNull();
  });

  it('should release the body scroll lock when destroyed while open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(document.body.classList).toContain('lz-modal-scroll-lock');

    fixture.destroy();

    expect(document.body.classList).not.toContain('lz-modal-scroll-lock');
  });
});
