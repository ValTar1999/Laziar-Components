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
});
