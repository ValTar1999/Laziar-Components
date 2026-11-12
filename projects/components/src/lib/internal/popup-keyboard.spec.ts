import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from '../card/card.component';
import { LanguageDropdown } from '../language-dropdown/language-dropdown.component';
import { ModalComponent } from '../modal/modal.component';
import { Table } from '../table/table.component';

@Component({
  standalone: true,
  imports: [ModalComponent],
  template: `
    <lz-modal [open]="true" title="Settings">
      <div lz-modal-header>Custom header</div>
    </lz-modal>
  `,
})
class CustomHeaderModalHost {}

/** Popups a keyboard user opens, walks through and leaves. */
describe('Popup keyboard behaviour', () => {
  let fixture: ComponentFixture<unknown>;

  function create<T>(type: Type<T>, inputs: Record<string, unknown> = {}) {
    const created = TestBed.createComponent(type) as ComponentFixture<T>;
    for (const [name, value] of Object.entries(inputs)) {
      created.componentRef.setInput(name, value);
    }
    created.detectChanges();
    // Focus only moves in elements that are in the document.
    document.body.appendChild(created.nativeElement);
    fixture = created;
    return created;
  }

  const press = (target: Element | Document, key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    fixture.detectChanges();
    return event;
  };
  const focused = (): HTMLElement => document.activeElement as HTMLElement;

  afterEach(() => {
    fixture.nativeElement.remove();
    fixture.destroy();
  });

  describe('lz-language-dropdown', () => {
    let trigger: HTMLButtonElement;

    beforeEach(() => {
      localStorage.removeItem('appLanguage');
      const root: HTMLElement = create(LanguageDropdown).nativeElement;
      trigger = root.querySelector('.lz-language-dropdown__trigger')!;
      trigger.focus();
    });

    afterEach(() => localStorage.removeItem('appLanguage'));

    it('says what it is and which language is chosen', () => {
      expect(trigger.getAttribute('aria-label')).toBe('Language: Română');
    });

    it('opens with ArrowDown on the current language and walks the list with the arrows', async () => {
      press(trigger, 'ArrowDown');
      await fixture.whenStable();

      expect(focused().getAttribute('aria-selected')).toBe('true');
      expect(focused().textContent).toContain('Română');

      press(focused(), 'ArrowDown');
      expect(focused().textContent).toContain('Русский');

      press(focused(), 'End');
      expect(focused().textContent).toContain('Italiano');

      press(focused(), 'ArrowDown');
      expect(focused().textContent).withContext('wraps to the top').toContain('Română');
    });

    it('gives focus back to the trigger on Escape, on a choice and on Tab', async () => {
      for (const leave of ['Escape', 'Enter', 'Tab']) {
        press(trigger, 'ArrowDown');
        await fixture.whenStable();
        expect(focused().getAttribute('role')).toBe('option');

        press(leave === 'Escape' ? document : focused(), leave);

        expect(focused()).withContext(leave).toBe(trigger);
        expect(document.querySelector('.lz-language-dropdown__menu')).withContext(leave).toBeNull();
      }
    });
  });

  describe('lz-table page size', () => {
    let trigger: HTMLButtonElement;
    const options = (): HTMLElement[] =>
      Array.from(document.querySelectorAll('.lz-table__page-size-option'));

    beforeEach(() => {
      const root: HTMLElement = create(Table, {
        columns: [{ key: 'id', header: 'ID' }],
        data: [{ id: 1 }],
        showPagination: true,
        totalItems: 60,
        pageSize: 25,
        pageSizeAriaLabel: 'Rows per page',
        paginationAriaLabel: 'Pages',
        previousPageLabel: 'Previous page',
        nextPageLabel: 'Next page',
      }).nativeElement;
      trigger = root.querySelector('.lz-table__page-size button')!;
    });

    it('puts the popup state on the real button', () => {
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.getAttribute('aria-label')).toBe('Rows per page: 25');

      trigger.click();
      fixture.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(document.getElementById(trigger.getAttribute('aria-controls')!)).not.toBeNull();
    });

    it('opens on the current size, walks with the arrows and returns focus on Escape', () => {
      trigger.focus();
      trigger.click();
      fixture.detectChanges();

      expect(focused().textContent?.trim()).toBe('25');

      press(focused(), 'ArrowDown');
      expect(focused().textContent?.trim()).toBe('50');

      const escape = press(document, 'Escape');

      expect(escape.defaultPrevented).withContext('claimed, so a modal stays open').toBeTrue();
      expect(options().length).toBe(0);
      expect(focused()).toBe(trigger);
    });

    it('names the pager and its arrows with the given strings', () => {
      const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
      const labels = Array.from(nav.querySelectorAll('[aria-label]')).map((el) =>
        el.getAttribute('aria-label'),
      );

      expect(nav.getAttribute('aria-label')).toBe('Pages');
      expect(labels).toEqual(['Previous page', 'Next page']);
    });
  });

  describe('lz-card More menu', () => {
    let trigger: HTMLButtonElement;

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
      const card = create(CardComponent, { title: 'Headline', image: '/cover.jpg' });
      card.componentInstance['onWindowResize']();
      trigger = card.nativeElement.querySelector('[aria-haspopup="menu"]')!;
    });

    it('moves focus into the menu, walks it with the arrows and returns focus on Escape', () => {
      trigger.focus();
      trigger.click();
      fixture.detectChanges();

      const menu = document.querySelector('.lz-card-cdk-pane lz-more-actions-menu')!;
      expect(menu.getAttribute('role')).toBe('menu');
      expect(menu.getAttribute('aria-label')).toBe('More');
      expect(focused().textContent).toContain('Share');

      press(focused(), 'ArrowDown');
      expect(focused().textContent).toContain('Copy link');

      press(focused(), 'ArrowDown');
      expect(focused().textContent).withContext('disabled rows are skipped').toContain('Share');

      press(document, 'Escape');
      expect(document.querySelector('.lz-card-cdk-pane lz-more-actions-menu')).toBeNull();
      expect(focused()).toBe(trigger);
    });

    it('returns focus to the More button after an action', () => {
      trigger.focus();
      trigger.click();
      fixture.detectChanges();

      focused().click();
      fixture.detectChanges();

      expect(focused()).toBe(trigger);
    });

    it('offers the article link once: the image link is for the pointer only', () => {
      const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
      const reachable = links.filter((link) => link.getAttribute('aria-hidden') !== 'true');

      expect(links.length).toBe(2);
      expect(reachable.map((link) => link.textContent?.trim())).toEqual(['Headline']);
      expect(links.find((link) => !reachable.includes(link))!.tabIndex).toBe(-1);
    });
  });

  describe('lz-modal name', () => {
    const dialog = (): HTMLElement => fixture.nativeElement.querySelector('[role="dialog"]');

    it('points at its title when the title is on screen', () => {
      create(ModalComponent, { open: true, title: 'Settings' });

      const title = document.getElementById(dialog().getAttribute('aria-labelledby')!);
      expect(title?.textContent).toBe('Settings');
      expect(dialog().hasAttribute('aria-label')).toBeFalse();
    });

    it('falls back to the title text when a custom header replaces the title', () => {
      create(CustomHeaderModalHost);

      expect(dialog().hasAttribute('aria-labelledby')).toBeFalse();
      expect(dialog().getAttribute('aria-label')).toBe('Settings');
    });
  });
});
