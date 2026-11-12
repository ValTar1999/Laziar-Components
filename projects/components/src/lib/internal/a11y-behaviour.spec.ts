import { Type } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Alert } from '../alert/alert.component';
import { Expand } from '../expand/expand.component';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { TabButton } from '../tab-button/tab-button.component';
import { Tabs } from '../tabs/tabs.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { ToastContainer } from '../toast/toast-container.component';
import { ToastService } from '../toast/toast.service';

/** What assistive tech and keyboard users get from each component. */
describe('Accessibility behaviour', () => {
  function create<T>(type: Type<T>, inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(type);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  describe('field errors and hints', () => {
    it('lz-input ties the error text to the field and flags it invalid', () => {
      const fixture = create(InputComponent, {
        label: 'Email',
        error: true,
        required: true,
        helperText: 'Enter a valid address',
      });
      const field: HTMLInputElement = fixture.nativeElement.querySelector('input');
      const helper: HTMLElement = fixture.nativeElement.querySelector('.lz-input-helper');

      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toBe(helper.id);
      expect(field.required).toBeTrue();
    });

    it('lz-input stays unflagged and undescribed without an error or hint', () => {
      const field: HTMLInputElement = create(InputComponent).nativeElement.querySelector('input');

      expect(field.hasAttribute('aria-invalid')).toBeFalse();
      expect(field.hasAttribute('aria-describedby')).toBeFalse();
      expect(field.required).toBeFalse();
    });

    it('lz-input names a field that has no visible label, and its icon-only button', () => {
      const fixture = create(InputComponent, {
        type: 'search',
        ariaLabel: 'Search articles',
        withButton: 'right',
        iconButton: 'magnifying-glass',
        buttonAriaLabel: 'Search',
      });
      const root: HTMLElement = fixture.nativeElement;

      expect(root.querySelector('input')!.getAttribute('aria-label')).toBe('Search articles');
      expect(root.querySelector('.lz-input-addon')!.getAttribute('aria-label')).toBe('Search');
    });

    it('lz-textarea ties the error text to the field and flags it invalid', () => {
      const fixture = create(TextareaComponent, {
        ariaLabel: 'Comment',
        error: true,
        helperText: 'Required field',
      });
      const field: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      const helper: HTMLElement = fixture.nativeElement.querySelector('.lz-textarea-helper');

      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toBe(helper.id);
      expect(field.getAttribute('aria-label')).toBe('Comment');
    });

    it('lz-select is named by its label and its chosen value, and described by its hint', () => {
      const fixture = create(SelectComponent, {
        label: 'Country',
        options: ['Moldova', 'Romania'],
        helperText: 'Where the campaign runs',
      });
      const root: HTMLElement = fixture.nativeElement;
      const trigger = root.querySelector('.lz-select-trigger')!;
      const ids = trigger.getAttribute('aria-labelledby')!.split(' ');

      expect(ids.map((id) => root.querySelector('#' + id)?.className)).toEqual([
        'lz-select-label',
        'lz-select-value',
      ]);
      expect(trigger.getAttribute('aria-describedby')).toBe(
        root.querySelector('.lz-select-helper')!.id,
      );
    });
  });

  describe('lz-tabs', () => {
    let fixture: ComponentFixture<Tabs>;
    const tabs = (): HTMLButtonElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
    const press = (index: number, key: string) => {
      tabs()[index].dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
    };

    beforeEach(() => {
      fixture = create(Tabs, {
        tabs: ['Overview', 'Stats', 'Billing'],
        activeTab: 0,
        disabledTabIndexes: [2],
        disabledTabTooltips: { '2': 'Available on the paid plan' },
        ariaLabel: 'Campaign sections',
      });
      document.body.appendChild(fixture.nativeElement);
    });

    afterEach(() => fixture.nativeElement.remove());

    it('is one tab stop: only the current tab is in the tab order', () => {
      expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
      expect(
        fixture.nativeElement.querySelector('[role="tablist"]').getAttribute('aria-label'),
      ).toBe('Campaign sections');
    });

    it('moves and selects with the arrow keys, wrapping at the ends', () => {
      press(0, 'ArrowRight');
      expect(fixture.componentInstance.activeTab()).toBe(1);
      expect(document.activeElement).toBe(tabs()[1]);
      expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, 0, -1]);

      press(1, 'Home');
      expect(fixture.componentInstance.activeTab()).toBe(0);

      press(0, 'ArrowLeft');
      expect(document.activeElement).toBe(tabs()[2]);
    });

    it('lets a disabled tab take focus to explain itself, without selecting it', () => {
      press(0, 'End');

      expect(document.activeElement).toBe(tabs()[2]);
      expect(fixture.componentInstance.activeTab()).toBe(0);
      expect(tabs()[2].getAttribute('aria-description')).toBe('Available on the paid plan');
    });
  });

  describe('lz-tab-button', () => {
    it('marks the current link as the current page', () => {
      const fixture = create(TabButton, { label: 'News', link: '/news', active: true });
      const link: HTMLElement = fixture.nativeElement.querySelector('a');

      expect(link.getAttribute('aria-current')).toBe('page');
    });

    it('marks the current button as pressed', () => {
      const fixture = create(TabButton, { label: 'News', active: true });
      const button: HTMLElement = fixture.nativeElement.querySelector('button');

      expect(button.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('lz-expand', () => {
    it('takes a collapsed panel out of the tab order and points the trigger at it', () => {
      const fixture = create(Expand, { title: 'Details', content: '<a href="#">More</a>' });
      const root: HTMLElement = fixture.nativeElement;
      const trigger = root.querySelector<HTMLButtonElement>('.lz-expand__trigger')!;
      const panel = root.querySelector<HTMLElement>('.lz-expand__content')!;

      expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.hasAttribute('inert')).toBeFalse();

      trigger.click();
      panel.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'height' }));
      fixture.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(panel.hasAttribute('inert')).toBeTrue();
    });
  });

  describe('lz-alert', () => {
    it('is a status region by default, with a close button that can be localized', () => {
      const fixture = create(Alert, { title: 'Saved', closeLabel: 'Închide' });
      const root: HTMLElement = fixture.nativeElement;

      expect(root.querySelector('.lz-alert')!.getAttribute('role')).toBe('status');
      expect(root.querySelector('button')!.getAttribute('aria-label')).toBe('Închide');
    });

    it('can interrupt, or be plain content', () => {
      const fixture = create(Alert, { role: 'alert' });
      const alert = fixture.nativeElement.querySelector('.lz-alert') as HTMLElement;
      expect(alert.getAttribute('role')).toBe('alert');

      fixture.componentRef.setInput('role', null);
      fixture.detectChanges();
      expect(alert.hasAttribute('role')).toBeFalse();
    });
  });

  describe('toasts', () => {
    it('hold their countdown while hovered or focused', fakeAsync(() => {
      const service = TestBed.inject(ToastService);
      const fixture = create(ToastContainer);
      service.show({ message: 'Saved', duration: 1000 });
      fixture.detectChanges();
      const item = (): HTMLElement | null =>
        fixture.nativeElement.querySelector('.lz-toast-container__item');

      tick(600);
      item()!.dispatchEvent(new MouseEvent('mouseenter'));
      tick(5000);
      fixture.detectChanges();
      expect(item()).withContext('still shown while hovered').not.toBeNull();

      item()!.dispatchEvent(new MouseEvent('mouseleave'));
      tick(399);
      fixture.detectChanges();
      expect(item()).withContext('the remaining time has not run out').not.toBeNull();

      tick(1);
      fixture.detectChanges();
      expect(item()).toBeNull();
      tick();
    }));

    it('interrupt for errors only', fakeAsync(() => {
      const service = TestBed.inject(ToastService);
      const fixture = create(ToastContainer);
      service.show({ message: 'Saved', duration: 0 });
      service.show({ message: 'Could not save', type: 'error', duration: 0 });
      fixture.detectChanges();
      const roles = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('.lz-toast-container__item'),
      ).map((item) => item.getAttribute('role'));

      expect(roles).toEqual([null, 'alert']);
      service.getToasts().forEach((toast) => service.remove(toast.id));
      tick();
    }));
  });
});
