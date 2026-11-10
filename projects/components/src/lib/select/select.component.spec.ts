import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SelectComponent } from './select.component';
import { LzSelectOptionType } from './select.types';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let overlayContainer: OverlayContainer;

  const stringOptions = ['Option 1', 'Option 2', 'Option 3'];
  const objectOptions: LzSelectOptionType[] = [
    { id: 1, title: 'First Option', date: '2023-01-01' },
    { id: 2, title: 'Second Option', date: '2023-01-02' },
    { id: 3, title: 'Third Option', date: '2023-01-03' },
  ];

  const dropdownEl = (): HTMLElement | null => document.querySelector('.lz-select-dropdown');
  const optionEls = (): NodeListOf<HTMLElement> => document.querySelectorAll('.lz-select-option');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render string options in the dropdown', () => {
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const options = optionEls();
    expect(options.length).toBe(3);
    expect(options[0].textContent).toContain('Option 1');
  });

  it('should render object option titles', () => {
    fixture.componentRef.setInput('options', objectOptions);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const options = optionEls();
    expect(options[0].textContent).toContain('First Option');
  });

  it('should toggle dropdown when clicked', () => {
    spyOn(component.opened, 'emit');

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    expect(dropdownEl()).toBeTruthy();
    expect(component.opened.emit).toHaveBeenCalled();
  });

  it('should attach the list to the overlay container', () => {
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.lz-select-trigger').click();
    fixture.detectChanges();

    expect(
      overlayContainer.getContainerElement().querySelector('.lz-select-dropdown'),
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.lz-select-dropdown')).toBeFalsy();
  });

  it('should select option when clicked', () => {
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    optionEls()[0].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lz-select-value').textContent.trim()).toBe(
      'Option 1',
    );
    expect(dropdownEl()).toBeFalsy();
  });

  it('should work with reactive forms', () => {
    const control = new FormControl<string | null>(null);
    fixture.componentRef.setInput('options', stringOptions);
    fixture.detectChanges();

    component.registerOnChange((value) => control.setValue(value as string));
    component.registerOnTouched(() => control.markAsTouched());

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();
    optionEls()[0].click();

    expect(control.value).toBe(stringOptions[0]);
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    expect(triggerButton.disabled).toBe(true);
    expect(triggerButton.getAttribute('data-disabled')).toBe('true');
    expect(fixture.nativeElement.querySelector('.lz-select-container--disabled')).toBeTruthy();
  });

  it('should respect CVA setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    expect(triggerButton.disabled).toBe(true);
  });

  it('should display label', () => {
    const label = 'Select Label';
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('.lz-select-label');
    expect(labelElement.textContent.trim()).toBe(label);
  });

  it('should display helper text', () => {
    const helperText = 'This is helper text';
    fixture.componentRef.setInput('helperText', helperText);
    fixture.detectChanges();

    const helperElement = fixture.nativeElement.querySelector('.lz-select-helper');
    expect(helperElement.textContent.trim()).toBe(helperText);
  });

  it('should show error icon with helper text', () => {
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('helperText', 'Required');
    fixture.detectChanges();

    const helper = fixture.nativeElement.querySelector('.lz-select-helper');
    expect(helper.getAttribute('data-error')).toBe('true');
    expect(helper.querySelector('.lz-select-helper-icon')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.lz-select-trigger').getAttribute('data-error'),
    ).toBe('true');
  });

  it('should identify selected options in the UI', () => {
    fixture.componentRef.setInput('options', objectOptions);
    component.writeValue(objectOptions[0]);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const selected = document.querySelector('.lz-select-option[data-selected="true"]');
    expect(selected?.textContent).toContain('First Option');
    expect(selected?.querySelector('.lz-select-check-badge')).toBeTruthy();
  });

  it('should close dropdown when clicking outside', () => {
    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();
    expect(dropdownEl()).toBeTruthy();

    document.body.click();
    fixture.detectChanges();
    expect(dropdownEl()).toBeFalsy();
  });

  it('should handle different sizes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    expect(triggerButton.getAttribute('data-size')).toBe('sm');
  });

  it('should render generic label/value options', () => {
    fixture.componentRef.setInput('options', [
      { value: 'ro', label: 'Română' },
      { value: 'en', label: 'English' },
    ]);
    fixture.detectChanges();

    const triggerButton = fixture.nativeElement.querySelector('.lz-select-trigger');
    triggerButton.click();
    fixture.detectChanges();

    const options = optionEls();
    expect(options.length).toBe(2);
    expect(options[0].textContent).toContain('Română');
    expect(options[1].textContent).toContain('English');
  });

  it('carries an object payload in value and hands back the same option', () => {
    const profile = { id: 'a1', name: 'Ana Pop' };
    const options: LzSelectOptionType[] = [
      { id: 0, title: 'Toți autorii', value: null },
      { id: 1, title: 'Ana Pop', value: profile },
    ];
    const changes: LzSelectOptionType[] = [];
    component.registerOnChange((v) => changes.push(v as LzSelectOptionType));
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.lz-select-trigger').click();
    fixture.detectChanges();
    optionEls()[1].click();
    fixture.detectChanges();

    expect(changes).toEqual([options[1]]);
    expect((changes[0] as { value: unknown }).value).toBe(profile);
    expect(fixture.nativeElement.querySelector('.lz-select-value').textContent.trim()).toBe(
      'Ana Pop',
    );
  });

  describe('searchable', () => {
    const searchEl = (): HTMLInputElement | null =>
      document.querySelector('.lz-select-search-input');
    const noResultsEl = (): HTMLElement | null => document.querySelector('.lz-select-no-results');

    function open(): void {
      fixture.nativeElement.querySelector('.lz-select-trigger').click();
      fixture.detectChanges();
    }

    function search(query: string): void {
      const el = searchEl()!;
      el.value = query;
      el.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    const titles = (): string[] =>
      Array.from(optionEls()).map((el) =>
        el.querySelector('.lz-select-option-title')!.textContent!.trim(),
      );

    beforeEach(() => {
      fixture.componentRef.setInput('options', objectOptions);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();
    });

    it('has no search box unless searchable', () => {
      fixture.componentRef.setInput('searchable', false);
      fixture.detectChanges();
      open();

      expect(searchEl()).toBeNull();
    });

    it('keeps the keyboard from correcting what is typed: it filters names, not prose', () => {
      open();
      const el = searchEl()!;

      expect(el.getAttribute('spellcheck')).toBe('false');
      expect(el.getAttribute('autocorrect')).toBe('off');
      expect(el.getAttribute('autocapitalize')).toBe('off');
      expect(el.getAttribute('autocomplete')).toBe('off');
    });

    it('shows a search box with the given placeholder', () => {
      fixture.componentRef.setInput('searchPlaceholder', 'Caută autor');
      fixture.detectChanges();
      open();

      expect(searchEl()?.placeholder).toBe('Caută autor');
    });

    it('filters options by title, ignoring case and surrounding spaces', () => {
      open();
      search('  SECOND ');

      expect(titles()).toEqual(['Second Option']);
    });

    it('matches the raw option date too', () => {
      open();
      search('2023-01-03');

      expect(titles()).toEqual(['Third Option']);
    });

    it('says so when nothing matches', () => {
      fixture.componentRef.setInput('noResultsText', 'Nu s-au găsit autori.');
      fixture.detectChanges();
      open();
      search('zzz');

      expect(optionEls().length).toBe(0);
      expect(noResultsEl()?.textContent?.trim()).toBe('Nu s-au găsit autori.');
    });

    it('selects from the filtered list', () => {
      const changes: unknown[] = [];
      component.registerOnChange((v) => changes.push(v));
      open();
      search('third');
      optionEls()[0].click();
      fixture.detectChanges();

      expect(changes).toEqual([objectOptions[2]]);
    });

    it('starts from the full list each time it opens', () => {
      open();
      search('second');
      document.body.click();
      fixture.detectChanges();

      open();

      expect(searchEl()?.value).toBe('');
      expect(titles().length).toBe(3);
    });

    it('keeps the dropdown open while typing in the search box', () => {
      open();
      searchEl()!.click();
      fixture.detectChanges();

      expect(dropdownEl()).toBeTruthy();
    });
  });

  describe('multiple', () => {
    const trigger = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.lz-select-trigger');
    const value = (): string =>
      fixture.nativeElement.querySelector('.lz-select-value').textContent.trim();
    const checkboxes = (): HTMLElement[] =>
      Array.from(document.querySelectorAll<HTMLElement>('.lz-select-option-checkbox'));

    function open(): void {
      trigger().click();
      fixture.detectChanges();
    }

    let changes: unknown[];

    beforeEach(() => {
      changes = [];
      component.registerOnChange((v) => changes.push(v));
      fixture.componentRef.setInput('options', objectOptions);
      fixture.componentRef.setInput('multiple', true);
      fixture.componentRef.setInput('placeholder', 'Choose…');
      fixture.detectChanges();
    });

    it('toggles options in and out of an array value, keeping the list open', () => {
      open();
      optionEls()[0].click();
      fixture.detectChanges();
      optionEls()[2].click();
      fixture.detectChanges();
      optionEls()[0].click();
      fixture.detectChanges();

      expect(changes).toEqual([
        [objectOptions[0]],
        [objectOptions[0], objectOptions[2]],
        [objectOptions[2]],
      ]);
      expect(dropdownEl()).toBeTruthy();
    });

    it('marks the list multiselectable and draws a checkbox per option', () => {
      component.writeValue([objectOptions[1]]);
      open();

      expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-multiselectable')).toBe(
        'true',
      );
      expect(checkboxes().map((box) => box.getAttribute('data-checked'))).toEqual([
        'false',
        'true',
        'false',
      ]);
      expect(optionEls()[1].getAttribute('aria-selected')).toBe('true');
      expect(document.querySelector('.lz-select-check-badge')).toBeNull();
    });

    it('lists the chosen labels in the trigger, or the placeholder when none', () => {
      expect(value()).toBe('Choose…');

      component.writeValue([objectOptions[0], objectOptions[2]]);
      fixture.detectChanges();

      expect(value()).toBe('First Option, Third Option');
      expect(trigger().getAttribute('data-selected')).toBe('true');
    });

    it('uses selectionSummary for the trigger text when given', () => {
      fixture.componentRef.setInput(
        'selectionSummary',
        (chosen: readonly LzSelectOptionType[]) => `${chosen.length} chosen`,
      );
      component.writeValue([objectOptions[0], objectOptions[1]]);
      fixture.detectChanges();

      expect(value()).toBe('2 chosen');
    });

    it('matches written options by id, so rebuilt option objects stay chosen', () => {
      component.writeValue([{ id: 2, title: 'Second Option' }]);
      open();

      expect(checkboxes()[1].getAttribute('data-checked')).toBe('true');
    });

    it('treats a null value as nothing chosen', () => {
      component.writeValue(null);
      fixture.detectChanges();

      expect(value()).toBe('Choose…');
    });

    it('marks the control touched when the list closes', () => {
      const touched = jasmine.createSpy('touched');
      component.registerOnTouched(touched);
      open();
      optionEls()[0].click();
      expect(touched).not.toHaveBeenCalled();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(touched).toHaveBeenCalled();
    });

    it('round-trips an array value through the value accessor', () => {
      const control = new FormControl<LzSelectOptionType[]>([objectOptions[0]]);
      component.registerOnChange((v) => control.setValue(v as LzSelectOptionType[]));
      component.writeValue(control.value);
      open();
      optionEls()[1].click();

      expect(control.value).toEqual([objectOptions[0], objectOptions[1]]);
    });
  });

  describe('keyboard', () => {
    const trigger = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.lz-select-trigger');
    const press = (target: Element, key: string): void => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    function open(): void {
      trigger().click();
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture.componentRef.setInput('options', objectOptions);
      fixture.detectChanges();
    });

    it('moves focus onto the chosen option when the list opens', () => {
      component.writeValue(objectOptions[1]);
      open();

      expect(document.activeElement).toBe(optionEls()[1]);
    });

    it('moves focus onto the search box of a searchable list', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();
      open();

      expect(document.activeElement).toBe(document.querySelector('.lz-select-search-input'));
    });

    it('walks the options with the arrows, Home and End, wrapping at the ends', () => {
      open();
      expect(document.activeElement).toBe(optionEls()[0]);

      press(optionEls()[0], 'ArrowDown');
      expect(document.activeElement).toBe(optionEls()[1]);
      press(optionEls()[1], 'End');
      expect(document.activeElement).toBe(optionEls()[2]);
      press(optionEls()[2], 'ArrowDown');
      expect(document.activeElement).toBe(optionEls()[0]);
      press(optionEls()[0], 'ArrowUp');
      expect(document.activeElement).toBe(optionEls()[2]);
      press(optionEls()[2], 'Home');
      expect(document.activeElement).toBe(optionEls()[0]);
    });

    it('goes from the search box into the list and back', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();
      open();
      const search = document.querySelector<HTMLInputElement>('.lz-select-search-input')!;

      press(search, 'ArrowDown');
      expect(document.activeElement).toBe(optionEls()[0]);
      press(optionEls()[0], 'ArrowUp');
      expect(document.activeElement).toBe(search);
    });

    it('chooses with Enter and gives focus back to the trigger', () => {
      const changes: unknown[] = [];
      component.registerOnChange((v) => changes.push(v));
      open();

      press(optionEls()[2], 'Enter');

      expect(changes).toEqual([objectOptions[2]]);
      expect(dropdownEl()).toBeNull();
      expect(document.activeElement).toBe(trigger());
    });

    it('toggles with Space in a multiple list without closing it', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();
      open();

      press(optionEls()[0], ' ');

      expect(dropdownEl()).toBeTruthy();
      expect(optionEls()[0].getAttribute('aria-selected')).toBe('true');
    });

    it('gives focus back to the trigger on Escape and on Tab', () => {
      open();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(dropdownEl()).toBeNull();
      expect(document.activeElement).toBe(trigger());

      open();
      press(optionEls()[0], 'Tab');
      expect(dropdownEl()).toBeNull();
      expect(document.activeElement).toBe(trigger());
    });

    it('names the list after the label', () => {
      fixture.componentRef.setInput('label', 'Country');
      fixture.detectChanges();
      open();

      const labelId = fixture.nativeElement.querySelector('.lz-select-label').id;
      expect(labelId).toBeTruthy();
      expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-labelledby')).toBe(
        labelId,
      );
    });
  });
});
