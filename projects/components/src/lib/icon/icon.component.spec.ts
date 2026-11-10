import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from './icon.component';

@Component({
  imports: [Icon],
  template: `
    <lz-icon id="classed" name="clock" class="probe-size probe-color" />
    <lz-icon id="hidden" name="clock" class="probe-hide" />
    <lz-icon id="plain" name="clock" />
  `,
})
class HostClassesComponent {}

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.componentRef.setInput('type', 'mini');
    fixture.detectChanges();
  });

  it('creates and points at the mini sprite symbol', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const useEl = fixture.nativeElement.querySelector('use') as SVGUseElement;
    expect(useEl.getAttribute('href')).toBe('assets/icons/icons-mini.svg#chevron-down');
    expect(fixture.nativeElement.getAttribute('data-type')).toBe('mini');
  });

  it('uses the outline sprite for stroked icons', () => {
    fixture.componentRef.setInput('type', 'outline');
    fixture.componentRef.setInput('name', 'arrow-right');
    fixture.detectChanges();

    const useEl = fixture.nativeElement.querySelector('use') as SVGUseElement;
    expect(useEl.getAttribute('href')).toBe('assets/icons/icons-outline.svg#arrow-right');
  });

  describe('classes on the host', () => {
    // Stands in for an app's utility CSS (Tailwind `w-4 h-4`, `text-*`, `hidden`):
    // plain, unlayered rules with the same specificity as the component's :host rules.
    let appStyles: HTMLStyleElement;
    let host: HTMLElement;

    beforeEach(() => {
      appStyles = document.createElement('style');
      appStyles.textContent =
        '.probe-size{width:1rem;height:1rem}' +
        '.probe-color{color:rgb(1, 2, 3)}' +
        '.probe-hide{display:none}';
      // First in <head>, as an app's global stylesheet is: component styles come after
      // it, so they win any tie on specificity.
      document.head.prepend(appStyles);

      const hostFixture = TestBed.createComponent(HostClassesComponent);
      host = hostFixture.nativeElement as HTMLElement;
      document.body.appendChild(host);
      hostFixture.detectChanges();
    });

    afterEach(() => {
      appStyles.remove();
      host.remove();
    });

    function icon(id: string): HTMLElement {
      return host.querySelector<HTMLElement>(`#${id}`)!;
    }

    it('lets a size class on the host beat the default size', () => {
      const box = icon('classed').getBoundingClientRect();
      expect(box.width).toBe(16);
      expect(box.height).toBe(16);
    });

    it('lets a color class on the host reach the svg', () => {
      const svg = icon('classed').querySelector('svg')!;
      expect(getComputedStyle(svg).color).toBe('rgb(1, 2, 3)');
    });

    it('lets a display class on the host hide the icon', () => {
      expect(getComputedStyle(icon('hidden')).display).toBe('none');
    });

    it('keeps the default size when the host has no size class', () => {
      const box = icon('plain').getBoundingClientRect();
      expect(box.width).toBe(24);
      expect(box.height).toBe(24);
    });
  });
});
