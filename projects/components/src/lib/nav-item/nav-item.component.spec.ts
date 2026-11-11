import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavItem } from './nav-item.component';

@Component({
  standalone: true,
  imports: [NavItem],
  template: `
    <a lz-nav-item href="#campaigns" icon="megaphone" [active]="active()">Campaigns</a>
    <a lz-nav-item href="#billing" aria-current="page">Billing</a>
    <button lz-nav-item type="button" disabled>Reports</button>
  `,
})
class NavItemHost {
  readonly active = signal(false);
}

describe('NavItem', () => {
  let fixture: ComponentFixture<NavItemHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NavItemHost] }).compileComponents();
    fixture = TestBed.createComponent(NavItemHost);
    fixture.detectChanges();
  });

  const items = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.lz-nav-item'));

  it('stays the element it is put on, so a link is still a link', () => {
    const [link, , button] = items();
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#campaigns');
    expect(button.tagName).toBe('BUTTON');
  });

  it('projects the label and draws the icon before it', () => {
    const [link] = items();
    expect(link.querySelector('.lz-nav-item__label')?.textContent?.trim()).toBe('Campaigns');
    const icon = link.querySelector('lz-icon');
    expect(icon).toBeTruthy();
    expect(link.firstElementChild).toBe(icon);
  });

  it('leaves out the icon when none is given', () => {
    expect(items()[1].querySelector('lz-icon')).toBeNull();
  });

  it('marks the active entry and draws it like aria-current="page"', () => {
    const [link, current] = items();
    expect(link.hasAttribute('data-active')).toBe(false);
    const idle = getComputedStyle(link).fontWeight;
    // The fill eases in; read the settled colour, not the first frame.
    link.style.transition = 'none';

    fixture.componentInstance.active.set(true);
    fixture.detectChanges();

    expect(link.getAttribute('data-active')).toBe('true');
    expect(getComputedStyle(link).fontWeight).toBe('600');
    expect(getComputedStyle(current).fontWeight).toBe('600');
    expect(getComputedStyle(link).backgroundColor).toBe(getComputedStyle(current).backgroundColor);
    expect(idle).toBe('500');
  });

  it('is 36px tall: 20px line and 8px padding', () => {
    expect(items()[0].getBoundingClientRect().height).toBe(36);
  });
});
