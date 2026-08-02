import {
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayModule, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { LzTooltipPosition, LzTooltipTheme, LzTooltipTrigger } from './tooltip.types';

/**
 * Tooltip as a content wrapper (`@laziar/components`).
 * Wraps a projected trigger (button, icon, link…) and shows a CDK Overlay panel.
 *
 * Selector aliases: `lz-tooltip` | `lz-tooltip-hover`
 */
@Component({
  selector: 'lz-tooltip, lz-tooltip-hover',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  host: {
    class: 'lz-tooltip-host',
  },
})
export class Tooltip implements OnInit, OnDestroy {
  /** Only one CDK tooltip should stay open (sidebar nav, dense icon rows). */
  private static readonly instances = new Set<Tooltip>();

  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly title = input('');
  readonly text = input('');
  readonly img = input('');
  readonly position = input<LzTooltipPosition>('top');
  readonly theme = input<LzTooltipTheme>('dark');
  readonly arrow = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly trigger = input<LzTooltipTrigger>('hover');
  /** Optional class on the trigger wrapper; defaults to `lz-tooltip__trigger`. */
  readonly triggerClass = input<string | undefined>(undefined);

  @ViewChild('panelTpl', { static: true }) panelTpl?: TemplateRef<unknown>;

  /** CDK pane class — mouseout guard + global z-index */
  readonly paneClass = 'lz-tooltip-cdk-pane';

  protected readonly showTooltip = signal(false);
  protected readonly cdkPositions = signal<ConnectedPosition[]>([]);

  protected readonly resolvedTriggerClass = computed(
    () => this.triggerClass() ?? 'lz-tooltip__trigger',
  );

  protected readonly arrowClasses = computed(() => `lz-tooltip__arrow--${this.position()}`);

  protected readonly arrowFill = computed(() => (this.theme() === 'dark' ? '#121212' : '#f4f5f5'));

  private overlayRef?: OverlayRef;
  private overlayExtrasCleanup?: () => void;
  private hideTimer?: ReturnType<typeof setTimeout>;
  /** Bridge gap between trigger and CDK pane */
  private readonly hideDelayMs = 100;

  constructor() {
    effect(() => {
      this.position();
      this.cdkPositions.set(this.buildCdkPositions());
    });

    effect(() => {
      if (this.disabled()) {
        this.forceClose();
      }
    });
  }

  ngOnInit(): void {
    Tooltip.instances.add(this);
  }

  ngOnDestroy(): void {
    Tooltip.instances.delete(this);
    this.clearHideTimer();
    this.disposeOverlay();
  }

  private static closeAllExcept(except: Tooltip): void {
    for (const c of Tooltip.instances) {
      if (c === except) continue;
      if (c.showTooltip() || c.overlayRef?.hasAttached()) {
        c.forceClose();
      }
    }
  }

  private forceClose(): void {
    this.clearHideTimer();
    this.showTooltip.set(false);
    this.disposeOverlay();
    this.cdr.detectChanges();
  }

  private hasPanelContent(): boolean {
    return !!(this.text().trim() || this.title().trim() || this.img());
  }

  private clearHideTimer(): void {
    if (this.hideTimer !== undefined) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }

  private scheduleHide(): void {
    this.clearHideTimer();
    this.hideTimer = setTimeout(() => {
      this.hideTimer = undefined;
      this.showTooltip.set(false);
      this.disposeOverlay();
      this.cdr.detectChanges();
    }, this.hideDelayMs);
  }

  onTriggerMouseEnter(): void {
    if (this.trigger() !== 'hover') return;
    if (this.disabled() || !this.hasPanelContent()) return;
    Tooltip.closeAllExcept(this);
    this.clearHideTimer();
    this.showTooltip.set(true);
    queueMicrotask(() => {
      this.openOverlay();
      this.cdr.detectChanges();
    });
  }

  onTriggerMouseLeave(event: MouseEvent): void {
    if (this.trigger() !== 'hover') return;
    if (this.disabled()) return;
    const related = event.relatedTarget as Node | null;
    const host = this.elementRef.nativeElement;
    if (related && host.contains(related)) return;
    if (related instanceof Element && related.closest(`.${this.paneClass}`)) return;

    this.scheduleHide();
  }

  /** On host so the trigger wrapper stays non-interactive for a11y lint / nested focus. */
  @HostListener('click', ['$event'])
  onTriggerClick(event: MouseEvent): void {
    if (this.trigger() !== 'click') return;
    if (this.disabled() || !this.hasPanelContent()) return;

    event.preventDefault();
    event.stopPropagation();

    if (this.showTooltip() && this.overlayRef?.hasAttached()) {
      this.forceClose();
      return;
    }

    Tooltip.closeAllExcept(this);
    this.clearHideTimer();
    this.showTooltip.set(true);
    queueMicrotask(() => {
      this.openOverlay();
      this.cdr.detectChanges();
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.trigger() !== 'click') return;
    if (!this.showTooltip()) return;

    const target = event.target as Node | null;
    if (!target) return;
    if (this.elementRef.nativeElement.contains(target)) return;
    if (target instanceof Element && target.closest(`.${this.paneClass}`)) return;

    this.forceClose();
  }

  private openOverlay(): void {
    if (!this.showTooltip() || !this.hasPanelContent()) return;
    if (this.overlayRef?.hasAttached()) return;

    const tpl = this.panelTpl;
    if (!tpl || !this.cdkPositions().length) return;

    this.disposeOverlay();

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.cdkPositions())
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: this.paneClass,
    });

    this.overlayRef.attach(new TemplatePortal(tpl, this.vcr));

    const pane = this.overlayRef.overlayElement;
    const onPaneEnter = () => this.clearHideTimer();
    const onPaneLeave = (e: MouseEvent) => {
      if (this.trigger() !== 'hover') return;
      const next = e.relatedTarget as Node | null;
      if (next && this.elementRef.nativeElement.contains(next)) return;
      this.showTooltip.set(false);
      this.disposeOverlay();
      this.cdr.detectChanges();
    };
    pane.addEventListener('mouseenter', onPaneEnter);
    pane.addEventListener('mouseleave', onPaneLeave);

    this.overlayExtrasCleanup = () => {
      pane.removeEventListener('mouseenter', onPaneEnter);
      pane.removeEventListener('mouseleave', onPaneLeave);
    };
  }

  private disposeOverlay(): void {
    this.clearHideTimer();
    this.overlayExtrasCleanup?.();
    this.overlayExtrasCleanup = undefined;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private buildCdkPositions(): ConnectedPosition[] {
    const g = 8;
    const flip = (a: ConnectedPosition, b: ConnectedPosition): ConnectedPosition[] => [a, b];

    switch (this.position()) {
      case 'top':
        return flip(
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -g,
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: g,
          },
        );
      case 'bottom':
        return flip(
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: g,
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -g,
          },
        );
      case 'left':
        return flip(
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -g,
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: g,
          },
        );
      case 'right':
        return flip(
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: g,
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -g,
          },
        );
      case 'top-left':
        return flip(
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -g,
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: g,
          },
        );
      case 'top-right':
        return flip(
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: -g,
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: g,
          },
        );
      case 'bottom-left':
        return flip(
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: g,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -g,
          },
        );
      case 'bottom-right':
        return flip(
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: g,
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: -g,
          },
        );
      default:
        return flip(
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -g,
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: g,
          },
        );
    }
  }
}

/** @deprecated Use {@link Tooltip}. Same component (`lz-tooltip-hover` selector still works). */
export { Tooltip as TooltipHover };
