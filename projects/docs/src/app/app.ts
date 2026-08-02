import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ToastContainer } from '@laziar/components';
import { filter } from 'rxjs';
import { DOCS_NAV, filterDocsNav } from './core/docs-nav';
import { DocsHeader } from './layout/docs-header/docs-header';
import { DocsSidebar } from './layout/docs-sidebar/docs-sidebar';

const DESKTOP_MQ = '(min-width: 861px)';

function desktopMatches(): boolean {
  return typeof window !== 'undefined' && typeof matchMedia === 'function'
    ? matchMedia(DESKTOP_MQ).matches
    : false;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DocsHeader, DocsSidebar, ToastContainer, TranslocoPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly headerRef = viewChild('headerHost', { read: ElementRef<HTMLElement> });

  private readonly searchQuery = signal('');
  protected readonly navCollapsed = signal(false);
  protected readonly mobileNavOpen = signal(false);
  protected readonly isDesktop = signal(desktopMatches());
  protected readonly headerHeight = signal(0);

  protected readonly navGroups = computed(() => filterDocsNav(this.searchQuery(), DOCS_NAV));

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeMobileNav());

    if (typeof window === 'undefined' || typeof matchMedia !== 'function') {
      return;
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeMobileNav();
      }
    };
    window.addEventListener('keydown', onKeydown);

    const mq = matchMedia(DESKTOP_MQ);
    const onChange = () => {
      this.isDesktop.set(mq.matches);
      if (mq.matches) {
        this.closeMobileNav();
      }
    };
    onChange();
    mq.addEventListener('change', onChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('keydown', onKeydown);
      mq.removeEventListener('change', onChange);
      document.body.style.overflow = '';
    });
  }

  ngAfterViewInit(): void {
    const host = this.headerRef()?.nativeElement;
    if (!host || typeof ResizeObserver === 'undefined') {
      return;
    }

    const update = () => this.headerHeight.set(host.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(host);
    this.destroyRef.onDestroy(() => ro.disconnect());
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  protected toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
    this.syncBodyScroll();
  }

  protected closeMobileNav(): void {
    if (!this.mobileNavOpen()) {
      return;
    }
    this.mobileNavOpen.set(false);
    this.syncBodyScroll();
  }

  private syncBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.style.overflow = this.mobileNavOpen() ? 'hidden' : '';
  }
}
