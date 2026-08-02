import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with source defaults', () => {
    expect(component).toBeTruthy();
    expect(component.title()).toBe('Menu');
    expect(component.sections()).toEqual([]);
    expect(component.sizeVariant()).toBe('xl');
  });

  it('emits the clicked item and closes', () => {
    const selected = spyOn(component.itemSelected, 'emit');
    const closed = spyOn(component.close, 'emit');

    component['isOpen'].set(true);
    component['selectItem']('Archive');

    expect(selected).toHaveBeenCalledWith('Archive');
    expect(closed).toHaveBeenCalled();
    expect(component['isOpen']()).toBeFalse();
  });
});
