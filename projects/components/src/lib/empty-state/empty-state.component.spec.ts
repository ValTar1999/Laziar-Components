import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state.component';

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EmptyState] }).compileComponents();
    fixture = TestBed.createComponent(EmptyState);
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
  });

  afterEach(() => host.remove());

  function render(inputs: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
  }

  const el = (selector: string): HTMLElement | null => host.querySelector<HTMLElement>(selector);
  const size = (selector: string): string => {
    const box = el(selector)!.getBoundingClientRect();
    return `${Math.round(box.width)}x${Math.round(box.height)}`;
  };

  it('renders the Figma circle: 40px with a 20px icon', () => {
    render({ icon: 'play-circle', heading: 'Nu ai încă videoclipuri' });

    expect(size('.lz-empty-state__icon')).toBe('40x40');
    expect(size('.lz-empty-state__icon lz-icon')).toBe('20x20');
    expect(el('.lz-empty-state__icon lz-icon')?.getAttribute('data-type')).toBe('outline');
  });

  it('shows heading and description', () => {
    render({ heading: 'Nimic aici', description: 'Încarcă primul video' });

    expect(el('.lz-empty-state__heading')?.textContent?.trim()).toBe('Nimic aici');
    expect(el('.lz-empty-state__description')?.textContent?.trim()).toBe('Încarcă primul video');
  });

  it('exposes the heading as a level-2 heading, level configurable', () => {
    render({ heading: 'Nimic aici' });
    expect(el('.lz-empty-state__heading')?.getAttribute('role')).toBe('heading');
    expect(el('.lz-empty-state__heading')?.getAttribute('aria-level')).toBe('2');

    render({ headingLevel: 3 });
    expect(el('.lz-empty-state__heading')?.getAttribute('aria-level')).toBe('3');
  });

  it('has no button without an action label', () => {
    render({ heading: 'Nimic aici' });

    expect(el('lz-button')).toBeNull();
  });

  it('emits action when its button is clicked', () => {
    let clicks = 0;
    fixture.componentInstance.action.subscribe(() => clicks++);
    render({ heading: 'Nimic aici', actionLabel: 'Încarcă', actionIcon: 'plus' });

    el('lz-button button')!.click();

    expect(clicks).toBe(1);
    expect(el('lz-button lz-icon')).not.toBeNull();
  });

  it('sits lower as a full-page state than as a section state', () => {
    render({ heading: 'Nimic aici' });
    const section = getComputedStyle(el('.lz-empty-state')!).paddingTop;

    render({ fullPage: true });
    const page = getComputedStyle(el('.lz-empty-state')!).paddingTop;

    expect(section).toBe('40px');
    expect(page).toBe('128px');
  });
});
