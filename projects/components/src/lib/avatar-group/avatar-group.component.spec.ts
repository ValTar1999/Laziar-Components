import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarGroup } from './avatar-group.component';
import { LzAvatarGroupItem } from './avatar-group.types';

describe('AvatarGroup', () => {
  let component: AvatarGroup;
  let fixture: ComponentFixture<AvatarGroup>;

  const mockAvatars: LzAvatarGroupItem[] = [
    { firstName: 'John', lastName: 'Doe', imgUrl: 'test1.jpg' },
    { firstName: 'Jane', lastName: 'Smith', imgUrl: 'test2.jpg' },
    { firstName: 'Bob', lastName: 'Johnson' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct number of avatars based on max', () => {
    fixture.componentRef.setInput('avatars', mockAvatars);
    fixture.componentRef.setInput('max', 2);
    fixture.detectChanges();

    expect(component['displayedAvatars']().length).toBe(2);
    expect(component['remainingCount']()).toBe(1);
  });

  it('should generate single initial for small sizes', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();

    const initials = component['getAvatarInitials'](mockAvatars[0]);
    expect(initials).toBe('J');
  });

  it('should generate full initials for larger sizes', () => {
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();

    const initials = component['getAvatarInitials'](mockAvatars[0]);
    expect(initials).toBe('JD');
  });
});
