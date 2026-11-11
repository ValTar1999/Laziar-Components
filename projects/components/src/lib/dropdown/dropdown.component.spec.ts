import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { DropdownComponent, LzDropdownTrigger } from './dropdown.component';
import { LzDropdownSection } from './dropdown.types';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let overlayContainer: OverlayContainer;

  const sections: LzDropdownSection[] = [
    { heading: 'Account', items: ['Profile', 'Settings'] },
    { heading: 'Actions', items: ['Archive', 'Delete'] },
  ];

  const menuEl = (): HTMLElement | null => document.querySelector('.lz-dropdown__menu');
  const itemEls = (): NodeListOf<HTMLElement> => document.querySelectorAll('.lz-dropdown__item');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    fixture.destroy();
  });

  it('creates with source defaults', () => {
    expect(component).toBeTruthy();
    expect(component.title()).toBe('Menu');
    expect(component.sections()).toEqual([]);
    expect(component.sizeVariant()).toBe('xl');
    expect(component.disabled()).toBeFalse();
  });

  it('opens the overlay menu on trigger click', () => {
    spyOn(component.opened, 'emit');
    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.lz-dropdown__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(menuEl()).toBeTruthy();
    expect(itemEls().length).toBe(4);
    expect(component.opened.emit).toHaveBeenCalled();
  });

  it('emits the clicked item and closes', () => {
    const selected = spyOn(component.itemSelected, 'emit');
    const closed = spyOn(component.close, 'emit');
    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.lz-dropdown__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    itemEls()[1].click();
    fixture.detectChanges();

    expect(selected).toHaveBeenCalledWith('Settings');
    expect(closed).toHaveBeenCalled();
    expect(menuEl()).toBeNull();
  });

  it('does not open when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.lz-dropdown__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(menuEl()).toBeNull();
  });

  describe('item objects', () => {
    const triggerEl = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;

    function open(withSections: LzDropdownSection[]): void {
      fixture.componentRef.setInput('sections', withSections);
      fixture.detectChanges();
      triggerEl().click();
      fixture.detectChanges();
    }

    it('renders plain strings and objects side by side', () => {
      open([{ heading: '', items: ['Edit', { label: 'Delete', tone: 'danger' }] }]);

      expect(itemEls().length).toBe(2);
      expect(itemEls()[0].textContent?.trim()).toBe('Edit');
      expect(itemEls()[1].textContent?.trim()).toBe('Delete');
    });

    it('emits value when set, otherwise the label', () => {
      const selected = spyOn(component.itemSelected, 'emit');
      open([
        { heading: '', items: [{ label: 'View details', value: 'view' }, { label: 'Archive' }] },
      ]);

      itemEls()[0].click();
      expect(selected).toHaveBeenCalledWith('view');

      triggerEl().click();
      fixture.detectChanges();
      itemEls()[1].click();
      expect(selected).toHaveBeenCalledWith('Archive');
    });

    it('renders a leading icon for an item with icon', () => {
      open([{ heading: '', items: [{ label: 'Duplicate', icon: 'document-duplicate' }, 'Plain'] }]);

      expect(itemEls()[0].querySelector('.lz-dropdown__item-icon')).toBeTruthy();
      expect(itemEls()[1].querySelector('.lz-dropdown__item-icon')).toBeNull();
    });

    it('marks a danger item with data-tone', () => {
      open([{ heading: '', items: [{ label: 'Delete', tone: 'danger' }, 'Edit'] }]);

      expect(itemEls()[0].getAttribute('data-tone')).toBe('danger');
      expect(itemEls()[1].hasAttribute('data-tone')).toBeFalse();
    });

    it('does not emit or close for a disabled item', () => {
      const selected = spyOn(component.itemSelected, 'emit');
      open([{ heading: '', items: [{ label: 'Delete', disabled: true }] }]);

      const item = itemEls()[0] as HTMLButtonElement;
      expect(item.disabled).toBeTrue();
      component['selectItem']({
        label: 'Delete',
        value: 'Delete',
        icon: undefined,
        tone: 'default',
        disabled: true,
        selected: null,
      });

      expect(selected).not.toHaveBeenCalled();
      expect(menuEl()).toBeTruthy();
    });

    it('renders pick-one items as menuitemradio with a check on the selected one', () => {
      open([
        {
          heading: 'Organizations',
          items: [
            { label: 'Acme Media', selected: true },
            { label: 'Globex Ads', selected: false },
          ],
        },
        { heading: '', items: [{ label: 'Add organization', icon: 'plus' }] },
      ]);

      const [current, other, action] = Array.from(itemEls());
      expect(current.getAttribute('role')).toBe('menuitemradio');
      expect(current.getAttribute('aria-checked')).toBe('true');
      expect(current.querySelector('.lz-dropdown__item-check')).toBeTruthy();
      expect(other.getAttribute('role')).toBe('menuitemradio');
      expect(other.getAttribute('aria-checked')).toBe('false');
      expect(other.querySelector('.lz-dropdown__item-check')).toBeNull();
      expect(action.getAttribute('role')).toBe('menuitem');
      expect(action.hasAttribute('aria-checked')).toBeFalse();
    });

    it('keeps plain string items as menuitem without aria-checked', () => {
      open(sections);
      for (const item of Array.from(itemEls())) {
        expect(item.getAttribute('role')).toBe('menuitem');
        expect(item.hasAttribute('aria-checked')).toBeFalse();
      }
    });
  });

  describe('trigger', () => {
    const triggerEl = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;

    it('shows a leading icon next to the title', () => {
      fixture.componentRef.setInput('title', 'Acme Media');
      fixture.componentRef.setInput('icon', 'building-office-2');
      fixture.detectChanges();

      expect(triggerEl().querySelector('.lz-dropdown__trigger-icon')).toBeTruthy();
      expect(triggerEl().querySelector('.lz-dropdown__title')?.textContent).toContain('Acme Media');
      expect(triggerEl().querySelector('.lz-dropdown__chevron')).toBeTruthy();
      expect(triggerEl().hasAttribute('data-icon-only')).toBeFalse();
    });

    it('renders an icon-only trigger without title or chevron, named by ariaLabel', () => {
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('icon', 'ellipsis-vertical');
      fixture.componentRef.setInput('ariaLabel', 'Campaign actions');
      fixture.detectChanges();

      expect(triggerEl().getAttribute('data-icon-only')).toBe('true');
      expect(triggerEl().getAttribute('aria-label')).toBe('Campaign actions');
      expect(triggerEl().querySelector('.lz-dropdown__title')).toBeNull();
      expect(triggerEl().querySelector('.lz-dropdown__chevron')).toBeNull();
    });

    it('draws an xs icon-only trigger as a 24px round button with a 16px icon', () => {
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('icon', 'ellipsis-horizontal');
      fixture.componentRef.setInput('ariaLabel', 'Row actions');
      fixture.componentRef.setInput('sizeVariant', 'xs');
      fixture.detectChanges();

      const box = triggerEl().getBoundingClientRect();
      expect(box.width).toBe(24);
      expect(box.height).toBe(24);
      expect(getComputedStyle(triggerEl()).borderTopLeftRadius).toBe('9999px');
      const icon = triggerEl().querySelector('.lz-dropdown__trigger-icon') as HTMLElement;
      expect(icon.getBoundingClientRect().width).toBe(16);
    });

    it('omits aria-label by default', () => {
      expect(triggerEl().hasAttribute('aria-label')).toBeFalse();
    });

    it('stretches to the host width with fullWidth', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList).toContain('lz-dropdown-host--full');
      expect(fixture.nativeElement.querySelector('.lz-dropdown--full')).toBeTruthy();
    });

    it('defaults placement to bottom-start', () => {
      expect(component.placement()).toBe('bottom-start');
    });

    it('labels the menu by its trigger', () => {
      fixture.componentRef.setInput('sections', sections);
      fixture.detectChanges();
      triggerEl().click();
      fixture.detectChanges();

      expect(menuEl()?.getAttribute('aria-labelledby')).toBe(component.dropdownId);
    });
  });

  describe('keyboard and focus', () => {
    const triggerEl = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;

    function key(name: string): void {
      menuEl()!.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture.componentRef.setInput('sections', [
        { heading: '', items: ['View', { label: 'Pause', disabled: true }, 'Duplicate', 'Delete'] },
      ]);
      fixture.detectChanges();
      triggerEl().click();
      fixture.detectChanges();
      itemEls()[0].focus();
    });

    it('moves down through enabled items, skipping disabled ones, and wraps', () => {
      key('ArrowDown');
      expect(document.activeElement?.textContent?.trim()).toBe('Duplicate');
      key('ArrowDown');
      expect(document.activeElement?.textContent?.trim()).toBe('Delete');
      key('ArrowDown');
      expect(document.activeElement?.textContent?.trim()).toBe('View');
    });

    it('moves up and wraps to the last item', () => {
      key('ArrowUp');
      expect(document.activeElement?.textContent?.trim()).toBe('Delete');
    });

    it('jumps with Home and End', () => {
      key('End');
      expect(document.activeElement?.textContent?.trim()).toBe('Delete');
      key('Home');
      expect(document.activeElement?.textContent?.trim()).toBe('View');
    });

    it('returns focus to the trigger when an item is chosen', () => {
      itemEls()[2].click();
      fixture.detectChanges();

      expect(menuEl()).toBeNull();
      expect(document.activeElement).toBe(triggerEl());
    });

    it('returns focus to the trigger on Escape', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(menuEl()).toBeNull();
      expect(document.activeElement).toBe(triggerEl());
    });

    it('leaves focus alone on an outside click', () => {
      const outside = document.createElement('input');
      document.body.appendChild(outside);
      outside.focus();
      outside.click();
      fixture.detectChanges();

      expect(menuEl()).toBeNull();
      expect(document.activeElement).toBe(outside);
      outside.remove();
    });
  });
});

@Component({
  standalone: true,
  imports: [DropdownComponent, LzDropdownTrigger],
  template: `
    <lz-dropdown ariaLabel="Account" [sections]="sections">
      <span lzDropdownTrigger class="avatar">AP</span>
    </lz-dropdown>
  `,
})
class CustomTriggerHost {
  readonly sections: LzDropdownSection[] = [{ heading: '', items: ['Profile', 'Log out'] }];
}

describe('DropdownComponent with a projected trigger', () => {
  let fixture: ComponentFixture<CustomTriggerHost>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTriggerHost, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomTriggerHost);
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    fixture.destroy();
  });

  const trigger = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;

  it('draws the projected content in place of the title and chevron', () => {
    expect(trigger().querySelector('.avatar')?.textContent).toBe('AP');
    expect(trigger().querySelector('.lz-dropdown__title')).toBeNull();
    expect(trigger().querySelector('lz-icon')).toBeNull();
    expect(trigger().getAttribute('data-custom')).toBe('true');
    expect(trigger().getAttribute('data-icon-only')).toBeNull();
  });

  it('keeps the button: its name, its menu state and its click', () => {
    expect(trigger().getAttribute('aria-label')).toBe('Account');
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');

    trigger().click();
    fixture.detectChanges();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelectorAll('.lz-dropdown__item').length).toBe(2);
  });
});
