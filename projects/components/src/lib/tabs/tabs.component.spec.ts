import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs } from './tabs.component';

describe('Tabs', () => {
  let component: Tabs;
  let fixture: ComponentFixture<Tabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tabs', () => {
    fixture.componentRef.setInput('tabs', ['Tab 1', 'Tab 2', 'Tab 3']);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent?.trim()).toBe('Tab 1');
    expect(buttons[1].textContent?.trim()).toBe('Tab 2');
    expect(buttons[2].textContent?.trim()).toBe('Tab 3');
  });

  it('should update activeTab when tab is clicked', () => {
    fixture.componentRef.setInput('tabs', ['Tab 1', 'Tab 2']);
    fixture.componentRef.setInput('activeTab', 0);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe(1);
  });

  it('should apply active attribute to current tab', () => {
    fixture.componentRef.setInput('tabs', ['Tab 1', 'Tab 2']);
    fixture.componentRef.setInput('activeTab', 1);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[1].getAttribute('data-active')).toBe('true');
  });

  it('should show underline for non-outline styles', () => {
    fixture.componentRef.setInput('style', 'underline');
    fixture.componentRef.setInput('tabs', ['Tab 1', 'Tab 2']);
    fixture.detectChanges();

    const underline = fixture.nativeElement.querySelector('.lz-tabs__underline');
    expect(underline).toBeTruthy();
  });

  it('should not emit when disabled tab is clicked', () => {
    fixture.componentRef.setInput('tabs', ['Tab 1', 'Tab 2']);
    fixture.componentRef.setInput('disabledTabIndexes', [1]);
    fixture.componentRef.setInput('activeTab', 0);

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    expect(component.activeTab()).toBe(0);
  });

  it('should render badges when provided', () => {
    fixture.componentRef.setInput('tabs', ['Tab 1']);
    fixture.componentRef.setInput('badges', [{ text: '5', variant: 'red' }]);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('lz-badge');
    expect(badge).toBeTruthy();
  });
});
