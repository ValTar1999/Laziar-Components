import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avatar } from './avatar.component';

describe('Avatar', () => {
  let component: Avatar;
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate initials correctly', () => {
    fixture.componentRef.setInput('firstName', 'John');
    fixture.componentRef.setInput('lastName', 'Doe');
    fixture.detectChanges();

    expect(component['initials']()).toBe('JD');
  });

  it('should show placeholder when no name or image', () => {
    fixture.componentRef.setInput('firstName', '');
    fixture.componentRef.setInput('lastName', '');
    fixture.componentRef.setInput('imgUrl', undefined);
    fixture.detectChanges();

    expect(component['showPlaceholder']()).toBe(true);
  });

  it('should not show placeholder when image is provided', () => {
    fixture.componentRef.setInput('imgUrl', 'test.jpg');
    fixture.detectChanges();

    expect(component['hasImage']()).toBe(true);
    expect(component['showPlaceholder']()).toBe(false);
  });
});
