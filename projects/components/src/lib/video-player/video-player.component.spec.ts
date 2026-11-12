import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayer } from './video-player.component';

/** Lets the chained asset promises and the callbacks behind them run. */
const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('VideoPlayer', () => {
  let fixture: ComponentFixture<VideoPlayer>;
  /** What the next asset request does: load, fail, or stay pending. */
  let assetOutcome: 'load' | 'error' | 'pending';
  let requested: string[];
  /** The asset element left waiting by a 'pending' outcome. */
  let waiting: HTMLElement | null;
  let player: {
    dispose: jasmine.Spy;
    src: jasmine.Spy;
    playlist: jasmine.Spy;
  };
  let videojs: jasmine.Spy;
  let assetsPathSeq = 0;

  const host = (): HTMLElement => fixture.nativeElement;
  const fallback = () => host().querySelector('.lz-video-player__fallback');

  /** Each test gets its own asset URLs: loads are remembered per URL for the page. */
  function create(inputs: Record<string, unknown> = {}): void {
    fixture = TestBed.createComponent(VideoPlayer);
    fixture.componentRef.setInput('assetsPath', `/vjs-test-${assetsPathSeq}`);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
  }

  /** Stands in for the network: the element is never attached, its event is fired by hand. */
  function fakeAppend<T extends Node>(node: T): T {
    const element = node as unknown as HTMLScriptElement & HTMLLinkElement;
    requested.push(element.src || element.href);
    const outcome = assetOutcome;
    if (outcome === 'pending') {
      waiting = element;
    } else {
      queueMicrotask(() => element.dispatchEvent(new Event(outcome)));
    }
    return node;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayer],
    }).compileComponents();

    assetsPathSeq++;
    assetOutcome = 'load';
    requested = [];
    waiting = null;
    player = {
      dispose: jasmine.createSpy('dispose'),
      src: jasmine.createSpy('src'),
      playlist: jasmine.createSpy('playlist'),
    };
    videojs = jasmine.createSpy('videojs').and.returnValue(player);
    window.videojs = videojs;

    const realHeadAppend = document.head.appendChild.bind(document.head);
    const realBodyAppend = document.body.appendChild.bind(document.body);
    spyOn(document.head, 'appendChild').and.callFake(<T extends Node>(node: T): T =>
      node instanceof HTMLLinkElement && node.dataset['vjsAsset']
        ? fakeAppend(node)
        : realHeadAppend(node),
    );
    spyOn(document.body, 'appendChild').and.callFake(<T extends Node>(node: T): T =>
      node instanceof HTMLScriptElement && node.dataset['vjsAsset']
        ? fakeAppend(node)
        : realBodyAppend(node),
    );
  });

  afterEach(() => {
    fixture?.destroy();
    delete window.videojs;
  });

  it('should show a fallback when there is no source or Video.js', () => {
    create();

    expect(fallback()).toBeTruthy();
    expect(host().querySelector('video')).toBeNull();
    expect(requested).toEqual([]);
  });

  it('starts the player once the assets have loaded', async () => {
    create({ videoSrc: '/clip.mp4' });
    await settle();

    expect(videojs).toHaveBeenCalledTimes(1);
    const [element, options] = videojs.calls.mostRecent().args;
    expect(element).toBe(host().querySelector('video'));
    expect(options.sources).toEqual([{ src: '/clip.mp4', type: 'video/mp4' }]);
    expect(fallback()).toBeNull();
  });

  it('starts when the source arrives after the first render', async () => {
    create();
    expect(fallback()).toBeTruthy();

    fixture.componentRef.setInput('videoSrc', '/late.mp4');
    fixture.detectChanges();
    await settle();

    expect(fallback()).toBeNull();
    expect(videojs).toHaveBeenCalledTimes(1);
    expect(videojs.calls.mostRecent().args[1].sources[0].src).toBe('/late.mp4');
  });

  it('hands a changed source to the running player', async () => {
    create({ videoSrc: '/first.mp4' });
    await settle();

    fixture.componentRef.setInput('videoSrc', '/second.mp4');
    fixture.detectChanges();

    expect(player.src).toHaveBeenCalledOnceWith({ src: '/second.mp4', type: 'video/mp4' });
    expect(videojs).toHaveBeenCalledTimes(1);
  });

  it('shows the fallback when Video.js did not load', async () => {
    assetOutcome = 'error';
    delete window.videojs;
    create({ videoSrc: '/clip.mp4' });
    await settle();
    fixture.detectChanges();

    expect(fallback()).toBeTruthy();
  });

  it('asks again for an asset that failed for an earlier player', async () => {
    assetOutcome = 'error';
    delete window.videojs;
    create({ videoSrc: '/clip.mp4' });
    await settle();
    const firstRequests = [...requested];
    expect(firstRequests.length).toBe(5);
    fixture.destroy();

    // Same asset URLs, and this time the files are there.
    assetOutcome = 'load';
    window.videojs = videojs;
    requested = [];
    create({ videoSrc: '/clip.mp4' });
    await settle();

    expect(requested).toEqual(firstRequests);
    expect(videojs).toHaveBeenCalledTimes(1);
  });

  it('requests each asset once for players that share it', async () => {
    create({ videoSrc: '/clip.mp4' });
    await settle();
    expect(requested.length).toBe(5);
    fixture.destroy();

    requested = [];
    create({ videoSrc: '/other.mp4' });
    await settle();

    expect(requested).toEqual([]);
    expect(videojs).toHaveBeenCalledTimes(2);
  });

  it('does not start a player for a component destroyed while assets load', async () => {
    assetOutcome = 'pending';
    create({ videoSrc: '/clip.mp4' });
    expect(requested.length).toBe(1);

    fixture.destroy();
    // The stylesheet finally arrives; the rest of the chain follows it.
    assetOutcome = 'load';
    waiting!.dispatchEvent(new Event('load'));
    await settle();

    expect(requested.length).toBe(5);

    expect(videojs).not.toHaveBeenCalled();
  });

  it('disposes the player on destroy', async () => {
    create({ videoSrc: '/clip.mp4' });
    await settle();

    fixture.destroy();

    expect(player.dispose).toHaveBeenCalledTimes(1);
  });
});
