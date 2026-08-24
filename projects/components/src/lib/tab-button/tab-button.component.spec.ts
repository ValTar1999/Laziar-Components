import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TabButton } from './tab-button.component';

describe('TabButton', () => {
  let component: TabButton;
  let fixture: ComponentFixture<TabButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabButton],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TabButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.lz-tab-button__control')?.textContent?.trim()).toBe('Tab');
  });

  it('should render a button when no link is provided', () => {
    const control = fixture.nativeElement.querySelector('.lz-tab-button__control');
    expect(control?.tagName.toLowerCase()).toBe('button');
  });

  it('should apply active attributes when active', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    expect(root?.getAttribute('data-active')).toBe('true');
    expect(root?.getAttribute('data-variant')).toBe('bg');
  });

  it('should show line indicator when line variant is active', () => {
    fixture.componentRef.setInput('variant', 'line');
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    const line = fixture.nativeElement.querySelector('.lz-tab-button__line');
    expect(root?.getAttribute('data-variant')).toBe('line');
    expect(root?.getAttribute('data-active')).toBe('true');
    expect(line).toBeTruthy();
  });

  it('should apply size attribute', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    expect(root?.getAttribute('data-size')).toBe('lg');
  });

  it('should apply sm size attribute', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.lz-tab-button');
    expect(root?.getAttribute('data-size')).toBe('sm');
  });

  it('should render an anchor with router link when provided', () => {
    fixture.componentRef.setInput('link', '/test');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      'a.lz-tab-button__control',
    ) as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/test');
  });
});

/**
 * Contrast, asserted rather than eyeballed.
 *
 * The portal shipped four routed tab strips onto this component and only noticed
 * in the dark theme that the active one was unreadable. Nothing here could have
 * caught it: the `components` test target loaded no styles at all, so specs ran
 * without the token layer. It now loads `styles/theme.css`, and these cases fail
 * if a palette change or a rule edit drops either state below AA.
 */
describe('TabButton contrast', () => {
  let fixture: ComponentFixture<TabButton>;

  /**
   * Relative luminance per WCAG 2.1, from an opaque `rgb(r, g, b)` string.
   *
   * Throws on anything else rather than scoring it. `rgba(0, 0, 0, 0)` — what
   * `getComputedStyle` returns for a missing or transparent colour — parses to
   * three zeroes if the alpha is simply dropped, which scores as black and would
   * hand a *passing* ratio to a label on a white page. A guard whose job is to
   * fail the build before the page fails the user must not be fooled that way.
   */
  const luminance = (colour: string): number => {
    const channels = (colour.match(/[\d.]+/g) ?? []).map(Number);
    if (channels.length === 4 && channels[3] !== 1) {
      throw new Error(`Refusing to measure a non-opaque colour: ${colour}`);
    }
    if (channels.length < 3) {
      throw new Error(`Could not parse a colour from: ${colour}`);
    }
    const [r, g, b] = channels.slice(0, 3).map((channel) => {
      const v = channel / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const contrast = (a: string, b: string): number => {
    const [l1, l2] = [luminance(a), luminance(b)];
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  /** What the tab sits on: the page background the theme defines. */
  const pageBackground = (): string => {
    const token = getComputedStyle(document.documentElement)
      .getPropertyValue('--lz-color-background')
      .trim();
    const probe = document.createElement('div');
    probe.style.backgroundColor = token;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return resolved;
  };

  const controlColour = (): string =>
    getComputedStyle(fixture.nativeElement.querySelector('.lz-tab-button__control')).color;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabButton],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TabButton);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  for (const theme of ['light', 'dark'] as const) {
    describe(`in the ${theme} theme`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute('data-theme', theme);
      });

      // `solid` is an alias: the component normalises it to `bg` before it reaches
      // `data-variant`, so no `[data-variant='solid']` element ever exists and the
      // solid cases here render through the bg rules. They are not independent
      // coverage of a third appearance — they assert the alias keeps resolving.
      for (const variant of ['line', 'bg', 'solid'] as const) {
        it(`should give an inactive ${variant} tab at least AA contrast`, () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('active', false);
          fixture.detectChanges();

          // Inactive is transparent in every variant, so the page is what it sits on.
          expect(contrast(controlColour(), pageBackground())).toBeGreaterThanOrEqual(4.5);
        });
      }

      it('should give an active line tab at least AA contrast', () => {
        fixture.componentRef.setInput('variant', 'line');
        fixture.componentRef.setInput('active', true);
        fixture.detectChanges();

        expect(contrast(controlColour(), pageBackground())).toBeGreaterThanOrEqual(4.5);
      });

      // bg and solid fill a pill when active, so the label is read against that
      // fill rather than against the page.
      for (const variant of ['bg', 'solid'] as const) {
        it(`should give an active ${variant} tab at least AA contrast against its pill`, () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('active', true);
          fixture.detectChanges();

          const control = fixture.nativeElement.querySelector('.lz-tab-button__control');
          const style = getComputedStyle(control);

          expect(contrast(style.color, style.backgroundColor)).toBeGreaterThanOrEqual(4.5);
        });
      }
    });
  }
});
