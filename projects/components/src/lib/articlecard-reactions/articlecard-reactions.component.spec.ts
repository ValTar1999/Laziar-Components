import { TestBed } from '@angular/core/testing';
import { ArticlecardReactions } from './articlecard-reactions.component';

describe('ArticlecardReactions', () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ArticlecardReactions);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  const emojis = (root: HTMLElement): string[] =>
    Array.from(root.querySelectorAll('.lz-articlecard-reactions__emoji')).map(
      (el) => el.textContent?.trim() ?? '',
    );
  const badge = (root: HTMLElement): string | undefined =>
    root.querySelector('.lz-articlecard-reactions__more')?.textContent?.trim();

  it('shows a heart when there are no reactions yet', () => {
    const root: HTMLElement = create().nativeElement;

    expect(emojis(root)).toEqual(['❤️']);
    expect(badge(root)).toBeUndefined();
  });

  it('lists each reaction while there are fewer than four in total', () => {
    const root: HTMLElement = create({ articleMetrics: { '👍': 1, '🔥': 2 } }).nativeElement;

    expect(emojis(root)).toEqual(['👍', '🔥']);
    expect(badge(root)).toBeUndefined();
  });

  it('collapses to one emoji and a count from four reactions up', () => {
    const root: HTMLElement = create({ articleMetrics: { '👍': 3, '🔥': 2 } }).nativeElement;

    expect(emojis(root)).toEqual(['👍']);
    expect(badge(root)).toBe('+4');
  });

  it('counts a reaction without a usable number as one, and skips the "undefined" key', () => {
    const root: HTMLElement = create({
      articleMetrics: { '👍': 'many', '🔥': 0, undefined: 9 },
    }).nativeElement;

    expect(emojis(root)).toEqual(['👍', '🔥']);
    expect(badge(root)).toBeUndefined();
  });
});
