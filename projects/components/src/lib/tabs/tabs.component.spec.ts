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

  it('draws no indicator and selects nothing while activeTab points at no tab', () => {
    fixture.componentRef.setInput('style', 'underline');
    fixture.componentRef.setInput('tabs', ['Tab 1', 'Tab 2']);
    fixture.componentRef.setInput('activeTab', -1);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lz-tabs__underline')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-selected="true"]')).toBeNull();
  });

  it('should size underline-text indicator to the active label text', async () => {
    fixture.componentRef.setInput('style', 'underline-text');
    fixture.componentRef.setInput('tabs', ['Short', 'A much longer label']);
    fixture.componentRef.setInput('activeTab', 1);
    fixture.detectChanges();
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement;
    const list = host.querySelector('.lz-tabs')!.getBoundingClientRect();
    const label = host.querySelectorAll('.lz-tabs__label')[1].getBoundingClientRect();
    const underline = host.querySelector('.lz-tabs__underline')!.getBoundingClientRect();

    expect(underline.width).toBeCloseTo(label.width, 0);
    expect(underline.left - list.left).toBeCloseTo(label.left - list.left, 0);
  });

  describe('stretch', () => {
    const rects = () => {
      const host: HTMLElement = fixture.nativeElement;
      return {
        list: host.querySelector('.lz-tabs')!.getBoundingClientRect(),
        tabs: Array.from(host.querySelectorAll('.lz-tabs__tab')).map((tab) =>
          tab.getBoundingClientRect(),
        ),
        underline: host.querySelector('.lz-tabs__underline')!.getBoundingClientRect(),
      };
    };

    beforeEach(() => {
      fixture.componentRef.setInput('style', 'underline');
      fixture.componentRef.setInput('tabs', ['Short', 'A much longer label']);
      fixture.componentRef.setInput('activeTab', 1);
    });

    it('shares the strip equally by default', () => {
      fixture.detectChanges();
      const { tabs } = rects();
      expect(tabs[0].width).toBeCloseTo(tabs[1].width, 0);
    });

    it('keeps each tab to its label, left-aligned, and underlines the whole active tab', async () => {
      fixture.componentRef.setInput('stretch', false);
      fixture.detectChanges();
      await fixture.whenStable();

      const { list, tabs, underline } = rects();
      expect(tabs[0].left).toBeCloseTo(list.left, 0);
      expect(tabs[1].width).toBeGreaterThan(tabs[0].width);
      expect(tabs[0].width + tabs[1].width).toBeLessThan(list.width);
      expect(underline.width).toBeCloseTo(tabs[1].width, 0);
      expect(underline.left).toBeCloseTo(tabs[1].left, 0);
    });
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

  // Ported from publikator's own tabs component, which lz-tabs replaces there.
  describe('accessibility', () => {
    function render(activeTab: number, style: 'underline' | 'underline-text' = 'underline') {
      fixture.componentRef.setInput('tabs', ['General', 'Conținut']);
      fixture.componentRef.setInput('style', style);
      fixture.componentRef.setInput('activeTab', activeTab);
      fixture.detectChanges();

      return fixture.nativeElement as HTMLElement;
    }

    it('wraps the tabs in a tablist, so assistive tech reads them as one tab set', () => {
      const host = render(0);
      const list = host.querySelector('[role="tablist"]');
      const tabs = Array.from(host.querySelectorAll('[role="tab"]'));

      expect(list).not.toBeNull();
      expect(tabs.length).toBe(2);
      expect(tabs.every((tab) => tab.parentElement === list)).toBeTrue();
    });

    it('marks exactly the active tab as selected', () => {
      const selected = Array.from(render(1).querySelectorAll('[role="tab"]')).map((tab) =>
        tab.getAttribute('aria-selected'),
      );

      expect(selected).toEqual(['false', 'true']);
    });

    for (const style of ['underline', 'underline-text'] as const) {
      it(`hides the decorative ${style} indicator from assistive tech`, () => {
        const underline = render(0, style).querySelector('.lz-tabs__underline');

        expect(underline?.getAttribute('aria-hidden')).toBe('true');
      });
    }
  });
});
