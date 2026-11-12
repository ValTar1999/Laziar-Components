import { TestBed } from '@angular/core/testing';
import { LiveEventCard } from './live-event-card.component';

describe('LiveEventCard', () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(LiveEventCard);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  const entries = [
    { time: '12:01', text: 'Kick-off' },
    { time: '12:18', text: 'Goal' },
  ];

  it('renders the publisher, the title link and the entries in order', () => {
    const root: HTMLElement = create({
      publisher: 'Laziar Sport',
      eventTitle: 'Cupa Moldovei',
      link: '/live/42',
      entries,
    }).nativeElement;

    expect(root.querySelector('.lz-live-event-card__publisher')!.textContent).toContain(
      'Laziar Sport',
    );
    expect(root.querySelector('a')!.getAttribute('href')).toBe('/live/42');
    expect(
      Array.from(root.querySelectorAll('.lz-live-event-card__text')).map((el) => el.textContent),
    ).toEqual(['Kick-off', 'Goal']);
    // The line joins an entry to the next one, so the last has none.
    expect(root.querySelectorAll('.lz-live-event-card__connector').length).toBe(1);
  });

  it('emits open with the link on a plain click and keeps the page where it is', () => {
    const fixture = create({ eventTitle: 'Cupa', link: '/live/42' });
    const opened: string[] = [];
    fixture.componentInstance.open.subscribe((link) => opened.push(link));
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    fixture.nativeElement.querySelector('a').dispatchEvent(click);

    expect(opened).toEqual(['/live/42']);
    expect(click.defaultPrevented).toBeTrue();
  });

  it('leaves a Ctrl-click to the browser, so the link opens in a new tab', () => {
    const fixture = create({ eventTitle: 'Cupa', link: '#top' });
    const opened: string[] = [];
    fixture.componentInstance.open.subscribe((link) => opened.push(link));
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    // Note what the card decided, then stop the click here: left alone, Chrome
    // really opens a tab, which puts the test page in the background.
    let leftToBrowser = false;
    fixture.nativeElement.addEventListener('click', (event: Event) => {
      leftToBrowser = !event.defaultPrevented;
      event.preventDefault();
    });

    fixture.nativeElement.querySelector('a').dispatchEvent(click);

    expect(opened).toEqual([]);
    expect(leftToBrowser).toBeTrue();
  });

  it('emits publisherClick with the publisher name', () => {
    const fixture = create({ publisher: 'Laziar Sport' });
    const clicked: string[] = [];
    fixture.componentInstance.publisherClick.subscribe((name) => clicked.push(name));

    fixture.nativeElement.querySelector('.lz-live-event-card__publisher').click();

    expect(clicked).toEqual(['Laziar Sport']);
  });

  it('hides the actions unless asked for them', () => {
    expect(create().nativeElement.querySelector('.lz-live-event-card__actions')).toBeNull();
  });

  it('names each action by what it will do next and emits its toggle', () => {
    const fixture = create({ showActions: true, watchLater: true, isSaved: false });
    let watchLater = 0;
    let saved = 0;
    fixture.componentInstance.watchLaterToggle.subscribe(() => watchLater++);
    fixture.componentInstance.saveToListToggle.subscribe(() => saved++);
    const [watchButton, saveButton]: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.lz-live-event-card__action'),
    );

    expect(watchButton.getAttribute('aria-label')).toBe('Remove from Watch later');
    expect(saveButton.getAttribute('aria-label')).toBe('Save to list');

    watchButton.click();
    saveButton.click();

    expect([watchLater, saved]).toEqual([1, 1]);
  });
});
