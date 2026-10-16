import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  imports: [ModalComponent],
  template: `
    <lz-modal [open]="true" title="Layout">
      <button lz-modal-footer-start class="start">Schimbă Layout</button>
      <button lz-modal-footer class="end">Salvează</button>
    </lz-modal>
  `,
})
class FooterHostComponent {}

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

  it('should keep the panel through the leave animation, then unmount it', fakeAsync(() => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    expect(panelEl()?.classList).toContain('lz-modal--leaving');

    tick(400);
    fixture.detectChanges();
    expect(panelEl()).toBeNull();
  }));

  it('should cancel the leave when reopened mid-animation', fakeAsync(() => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    tick(400);
    fixture.detectChanges();

    expect(panelEl()).not.toBeNull();
    expect(panelEl()?.classList).not.toContain('lz-modal--leaving');
  }));

  it('should keep the close button on the right without a title', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const close = host().querySelector<HTMLElement>('.lz-modal__close');
    expect(close).not.toBeNull();
    expect(getComputedStyle(close!).marginLeft).not.toBe('0px');
  });

  it('should show dividers for the default variant and hide them for confirm', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(panelEl()?.classList).toContain('lz-modal--dividers');

    fixture.componentRef.setInput('variant', 'confirm');
    fixture.detectChanges();
    expect(panelEl()?.classList).not.toContain('lz-modal--dividers');

    fixture.componentRef.setInput('dividers', true);
    fixture.detectChanges();
    expect(panelEl()?.classList).toContain('lz-modal--dividers');
  });

  it('should render the confirm title, icon and description in the body', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('variant', 'confirm');
    fixture.componentRef.setInput('title', 'Delete short');
    fixture.componentRef.setInput('description', 'This cannot be undone.');
    fixture.componentRef.setInput('icon', 'x-circle');
    fixture.componentRef.setInput('tone', 'warning');
    fixture.detectChanges();

    const body = host().querySelector('.lz-modal__body')!;
    expect(body.querySelector('.lz-modal__title')?.textContent).toContain('Delete short');
    expect(body.querySelector('.lz-modal__icon')?.getAttribute('data-tone')).toBe('warning');
    expect(host().querySelector('.lz-modal__header .lz-modal__title')).toBeNull();

    const describedBy = panelEl()?.getAttribute('aria-describedby');
    expect(host().querySelector(`#${describedBy}`)?.textContent).toContain(
      'This cannot be undone.',
    );
    expect(host().querySelector(`#${panelEl()?.getAttribute('aria-labelledby')}`)).not.toBeNull();
  });

  it('should block every close path while busy', () => {
    const reasons: string[] = [];
    component.closed.subscribe((r) => reasons.push(r));

    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('busy', true);
    fixture.detectChanges();

    const close = host().querySelector<HTMLButtonElement>('.lz-modal__close')!;
    expect(close.disabled).toBe(true);
    close.click();
    backdropEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(reasons).toEqual([]);
  });

  it('should close only the topmost modal on Escape', () => {
    const second = TestBed.createComponent(ModalComponent);
    const outer: string[] = [];
    const inner: string[] = [];
    component.closed.subscribe((r) => outer.push(r));
    second.componentInstance.closed.subscribe((r) => inner.push(r));

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    second.componentRef.setInput('open', true);
    second.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(inner).toEqual(['escape']);
    expect(outer).toEqual([]);

    second.destroy();
  });

  it('should ignore backdrop and Escape when not dismissible', () => {
    const reasons: string[] = [];
    component.closed.subscribe((r) => reasons.push(r));

    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('dismissible', false);
    fixture.detectChanges();

    backdropEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(reasons).toEqual([]);
  });

  it('should hide the footer when nothing is projected into it', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const footer = host().querySelector<HTMLElement>('.lz-modal__footer')!;
    expect(getComputedStyle(footer).display).toBe('none');
  });

  it('should never put a divider under a confirm header', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('variant', 'confirm');
    fixture.componentRef.setInput('dividers', true);
    fixture.detectChanges();

    const header = host().querySelector<HTMLElement>('.lz-modal__header')!;
    expect(getComputedStyle(header).borderBottomStyle).toBe('none');
  });

  it('should split footer actions into start and end groups', () => {
    const hostFixture = TestBed.createComponent(FooterHostComponent);
    hostFixture.detectChanges();
    const root = hostFixture.nativeElement as HTMLElement;

    const footer = root.querySelector<HTMLElement>('.lz-modal__footer')!;
    expect(getComputedStyle(footer).display).toBe('flex');
    expect(root.querySelector('.lz-modal__footer-start .start')).not.toBeNull();
    expect(root.querySelector('.lz-modal__footer-end .end')).not.toBeNull();

    hostFixture.destroy();
  });
});
