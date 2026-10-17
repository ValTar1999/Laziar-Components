import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Alert } from './alert.component';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert],
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // isRow puts the body (title/text | actions) in a row from md up, but the icon
  // stays level with the title, as in publikator's alert; only isRowtext, which puts
  // title and text on one line, centres it.
  // The test browser is narrower than md, so this reads the md rules themselves.
  describe('icon alignment from md up', () => {
    function mdContentAlign(modifier: 'row' | 'row-text'): string[] {
      const found: string[] = [];
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRule[];
        try {
          rules = Array.from(sheet.cssRules);
        } catch {
          continue;
        }
        for (const rule of rules) {
          if (!(rule instanceof CSSMediaRule) || !rule.conditionText.includes('768px')) continue;
          for (const inner of Array.from(rule.cssRules)) {
            if (
              inner instanceof CSSStyleRule &&
              new RegExp(`\\.lz-alert--${modifier}(?![\\w-])`).test(inner.selectorText) &&
              inner.selectorText.includes('.lz-alert__content') &&
              inner.style.alignItems
            ) {
              found.push(inner.style.alignItems);
            }
          }
        }
      }
      return found;
    }

    it('keeps the icon at the top with isRow', () => {
      expect(mdContentAlign('row')).not.toContain('center');
    });

    it('centres the icon with isRowtext', () => {
      expect(mdContentAlign('row-text')).toEqual(['center']);
    });
  });

  it('should emit closed event when close button is clicked', () => {
    spyOn(component['closed'], 'emit');

    component['onCloseClick']();

    expect(component['closed'].emit).toHaveBeenCalled();
  });

  it('should apply correct variant class', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    const alertClass = component['alertClass']();
    expect(alertClass).toContain('lz-alert--success');
  });

  it('should apply row class when isRow is true', () => {
    fixture.componentRef.setInput('isRow', true);
    fixture.detectChanges();

    const alertClass = component['alertClass']();
    expect(alertClass).toContain('lz-alert--row');
  });
});

@Component({
  standalone: true,
  imports: [Alert],
  template: `<lz-alert title="Saved" />`,
})
class AlertFirstPaintHost {}

describe('Alert first paint (template-bound inputs)', () => {
  it('renders the title after a macrotask without a click', fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertFirstPaintHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(AlertFirstPaintHost);
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('.lz-alert__title')?.textContent).toContain('Saved');
  }));
});
