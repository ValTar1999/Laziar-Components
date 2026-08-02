import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with source defaults', () => {
    expect(component).toBeTruthy();
    expect(component.link()).toBe('#');
    expect(component.variant()).toBe('col');
    expect(component.size()).toBe('xl');
    expect(component.isLoading()).toBeFalse();
    expect(component.metricsType()).toBeFalse();
  });

  it('toggles bookmark state', () => {
    expect(component['isChecked']()).toBeFalse();

    component['toggleChecked']();

    expect(component['isChecked']()).toBeTrue();
  });
});
