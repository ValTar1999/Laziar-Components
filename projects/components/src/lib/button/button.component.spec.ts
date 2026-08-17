import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Button } from './button.component';
import { LZ_BUTTON_COLORS, LZ_BUTTON_SIZES, LZ_BUTTON_VARIANTS } from './button.types';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;
  let component: Button;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button.lz-button');
  }

  it('should create with a native button', () => {
    expect(component).toBeTruthy();
    expect(nativeButton()).toBeTruthy();
    expect(nativeButton().type).toBe('button');
  });

  it('should render the label', () => {
    fixture.componentRef.setInput('label', 'Save');
    fixture.detectChanges();
    expect(nativeButton().textContent).toContain('Save');
  });

  describe('variants', () => {
    for (const variant of LZ_BUTTON_VARIANTS) {
      it(`should apply data-variant="${variant}"`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(nativeButton().getAttribute('data-variant')).toBe(variant);
      });
    }
  });

  describe('sizes', () => {
    for (const size of LZ_BUTTON_SIZES) {
      it(`should apply data-size="${size}"`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(nativeButton().getAttribute('data-size')).toBe(size);
      });
    }
  });

  describe('colors', () => {
    for (const color of LZ_BUTTON_COLORS) {
      it(`should apply data-color="${color}"`, () => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();
        expect(nativeButton().getAttribute('data-color')).toBe(color);
      });
    }
  });

  it('should reflect disabled state on the native button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeButton().disabled).toBeTrue();
  });

  it('should set type submit|reset|button', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(nativeButton().type).toBe('submit');
  });

  it('should mark aria-current=page when ariaCurrentPage is true', () => {
    fixture.componentRef.setInput('ariaCurrentPage', true);
    fixture.detectChanges();
    expect(nativeButton().getAttribute('aria-current')).toBe('page');
  });

  it('should use ariaLabel on the native button (как в publikator)', () => {
    fixture.componentRef.setInput('ariaLabel', 'Close dialog');
    fixture.detectChanges();
    expect(nativeButton().getAttribute('aria-label')).toBe('Close dialog');
  });

  it('should mark icon-only when icon set and label empty', () => {
    fixture.componentRef.setInput('variant', 'iconOnly');
    fixture.componentRef.setInput('icon', 'plus');
    fixture.componentRef.setInput('ariaLabel', 'plus');
    fixture.detectChanges();
    expect(nativeButton().getAttribute('data-icon-only')).toBe('true');
    expect(nativeButton().getAttribute('aria-label')).toBe('plus');
  });

  it('should render lz-icon when icon name is set', () => {
    fixture.componentRef.setInput('label', 'Save');
    fixture.componentRef.setInput('icon', 'check');
    fixture.detectChanges();

    const icon = nativeButton().querySelector('lz-icon');
    expect(icon).toBeTruthy();
    expect(nativeButton().classList.contains('lz-button--icon-end')).toBeTrue();
    expect(nativeButton().querySelector('.lz-button__icon')).toBeTruthy();
  });

  it('should treat icon without label as icon-only', () => {
    fixture.componentRef.setInput('icon', 'search');
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();
    expect(nativeButton().getAttribute('data-icon-only')).toBe('true');
  });

  it('should apply pill via data-pill', () => {
    fixture.componentRef.setInput('pill', true);
    fixture.detectChanges();
    expect(nativeButton().getAttribute('data-pill')).toBe('true');
  });

  it('should stretch host when fullWidth is set', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('lz-button-host--full')).toBeTrue();
  });

  describe('clicked', () => {
    it('should emit when clicked', () => {
      const spy = jasmine.createSpy('clicked');
      component.clicked.subscribe(spy);
      nativeButton().click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not emit when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const spy = jasmine.createSpy('clicked');
      component.clicked.subscribe(spy);
      nativeButton().click();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('keyboard', () => {
    it('should be focusable and activate with Enter via native button', () => {
      const spy = jasmine.createSpy('clicked');
      component.clicked.subscribe(spy);
      const btn = nativeButton();
      btn.focus();
      expect(document.activeElement).toBe(btn);
      btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      btn.click();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deprecated aliases', () => {
    it('rounded should map to pill', () => {
      component.rounded = true;
      fixture.detectChanges();
      expect(nativeButton().getAttribute('data-pill')).toBe('true');
    });

    it('iconDirection should map to iconPosition', () => {
      fixture.componentRef.setInput('label', 'Next');
      fixture.componentRef.setInput('icon', 'arrow');
      component.iconDirection = 'left';
      fixture.detectChanges();
      expect(nativeButton().classList.contains('lz-button--icon-end')).toBeFalse();

      component.iconDirection = 'right';
      fixture.detectChanges();
      expect(nativeButton().classList.contains('lz-button--icon-end')).toBeTrue();
    });
  });
});

@Component({
  standalone: true,
  imports: [Button],
  template: `<lz-button label="Projected"><span class="extra">!</span></lz-button>`,
})
class ButtonProjectionHost {}

describe('Button first paint (template-bound inputs)', () => {
  @Component({
    standalone: true,
    imports: [Button],
    template: `<lz-button label="Light" />`,
  })
  class FirstPaintHost {}

  it('renders the label after a macrotask without a click', fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstPaintHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(FirstPaintHost);
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('.lz-button__label')?.textContent).toContain(
      'Light',
    );
  }));
});

describe('Button content projection', () => {
  it('should project default ng-content', async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonProjectionHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(ButtonProjectionHost);
    fixture.detectChanges();
    const extra = fixture.debugElement.query(By.css('.extra'));
    expect(extra.nativeElement.textContent).toContain('!');
  });
});
