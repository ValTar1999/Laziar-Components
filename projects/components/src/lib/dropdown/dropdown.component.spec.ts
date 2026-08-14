import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DropdownComponent } from './dropdown.component';
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

    const trigger = fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;
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

    const trigger = fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;
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

    const trigger = fixture.nativeElement.querySelector('.lz-dropdown__trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(menuEl()).toBeNull();
  });
});
