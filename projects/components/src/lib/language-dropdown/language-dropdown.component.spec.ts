import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageDropdown } from './language-dropdown.component';

describe('LanguageDropdown', () => {
  let component: LanguageDropdown;
  let fixture: ComponentFixture<LanguageDropdown>;
  let overlayContainer: OverlayContainer;

  const menuEl = (): HTMLElement | null => document.querySelector('.lz-language-dropdown__menu');
  const itemEls = (): NodeListOf<HTMLElement> =>
    document.querySelectorAll('.lz-language-dropdown__item');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageDropdown, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageDropdown);
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

  it('opens the overlay menu on trigger click', () => {
    const trigger = fixture.nativeElement.querySelector(
      '.lz-language-dropdown__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(menuEl()).toBeTruthy();
    expect(itemEls().length).toBe(6);
    expect(component['isOpen']()).toBeTrue();
  });

  it('emits languageChange and closes the overlay', () => {
    const changed = spyOn(component.languageChange, 'emit');
    const trigger = fixture.nativeElement.querySelector(
      '.lz-language-dropdown__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const italian = [...itemEls()].find((el) => el.textContent?.includes('Italiano'));
    italian?.click();
    fixture.detectChanges();

    expect(changed).toHaveBeenCalled();
    expect(changed.calls.mostRecent().args[0].code).toBe('it');
    expect(menuEl()).toBeNull();
  });

  it('closes on escape', () => {
    const trigger = fixture.nativeElement.querySelector(
      '.lz-language-dropdown__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(menuEl()).toBeTruthy();

    component['onEscape']();
    fixture.detectChanges();
    expect(menuEl()).toBeNull();
  });
});
