import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  numberAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { ArticlecardReactions } from '../articlecard-reactions/articlecard-reactions.component';
import { Avatar } from '../avatar/avatar.component';
import { Icon } from '../icon/icon.component';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { MoreActionsMenu } from '../more-actions-menu/more-actions-menu.component';
import { Tooltip } from '../tooltip/tooltip.component';
import {
  LzCardArticleSize,
  LzCardRowImageAspect,
  LzCardRowImageHeightMode,
  LzCardRowIdentityPosition,
  LzCardRowMetaLayout,
  LzCardRowSubtitleLayout,
  LzCardSize,
  LzCardVariant,
} from './card.types';

const ROW_BREAKPOINT = 768;
const MIN_ACCEPTED_IMAGE_WIDTH = 120;
const MIN_ACCEPTED_IMAGE_HEIGHT = 90;
const MENU_OFFSET_PX = 8;
const MENU_VIEWPORT_PADDING_PX = 8;

/** CDK portal only — coordinates come from Floating UI. */
function floatingUiPositionStrategy(): PositionStrategy {
  return {
    attach: () => undefined,
    apply: () => undefined,
    detach: () => undefined,
    dispose: () => undefined,
  };
}

@Component({
  selector: 'lz-card',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [
    NgTemplateOutlet,
    OverlayModule,
    Avatar,
    Icon,
    Tooltip,
    MoreActionsMenu,
    ArticlecardReactions,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lz-card-host',
  },
})
export class CardComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  readonly paneClass = 'lz-card-cdk-pane';

  @ViewChild('moreMenuTpl', { static: true })
  private moreMenuTpl?: TemplateRef<unknown>;

  readonly publisher = input('');
  readonly author = input('');
  readonly publisherLogoUrl = input('');
  readonly authorAvatarUrl = input('');
  readonly authorBadgeCount = input(0, { transform: numberAttribute });
  readonly image = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly date = input<string | undefined>(undefined);
  readonly link = input('#');
  readonly variant = input<LzCardVariant>('col');
  readonly size = input<LzCardSize>('xl');
  readonly rowImageHeightMode = input<LzCardRowImageHeightMode>('fixed');
  readonly rowIdentityPosition = input<LzCardRowIdentityPosition>('top');
  readonly rowMetaLayout = input<LzCardRowMetaLayout>('split');
  readonly rowImageAspect = input<LzCardRowImageAspect>('1/1');
  readonly rowImageAspectMd = input<LzCardRowImageAspect>('3/2');
  readonly rowSubtitleLayout = input<LzCardRowSubtitleLayout>('below');
  readonly rowSubtitleLayoutMd = input<LzCardRowSubtitleLayout>('beside');
  readonly showBottomBorder = input(true, { transform: booleanAttribute });
  readonly isLoading = input(false, { transform: booleanAttribute });
  readonly metricsType = input(false, { transform: booleanAttribute });
  readonly articleMetrics = input<Record<string, unknown> | null | undefined>(undefined);
  readonly openArticleId = input<number | string | null>(null);
  readonly showActions = input(true, { transform: booleanAttribute });
  /** Watch-later / save rows inside the more menu. Frontend listing cards set this to false. */
  readonly showSavedActions = input(false, { transform: booleanAttribute });
  readonly isWatchLater = input(false, { transform: booleanAttribute });
  readonly isSavedToList = input(false, { transform: booleanAttribute });
  readonly isPublisherFollowed = input(false, { transform: booleanAttribute });
  readonly isAuthorFollowed = input(false, { transform: booleanAttribute });

  readonly openArticle = output<string | number | null>();
  readonly publisherClick = output<void>();
  readonly authorClick = output<void>();
  readonly watchLater = output<void>();
  readonly saveToList = output<void>();
  readonly share = output<void>();
  readonly copyLink = output<void>();
  readonly report = output<void>();
  readonly publisherFollow = output<void>();
  readonly authorFollow = output<void>();

  protected readonly isMoreMenuOpen = signal(false);
  protected readonly mobileMoreSheetMounted = signal(false);
  protected readonly mobileMoreSheetActive = signal(false);
  protected readonly imageBroken = signal(false);

  private readonly viewportWidth = signal(this.readViewportWidth());
  private overlayRef?: OverlayRef;
  private floatingCleanup?: () => void;
  private activeMoreTrigger: HTMLElement | null = null;

  constructor() {
    effect(() => {
      this.image();
      this.imageBroken.set(false);
    });
  }

  protected readonly articleSize = computed<LzCardArticleSize>(() => {
    const size = this.size();
    if (size === 'xxs' || size === 'xs') {
      return 'sm';
    }

    return size;
  });

  protected readonly effectiveVariant = computed<LzCardVariant>(() => {
    const variant = this.variant();
    if (variant !== 'row') {
      return variant;
    }

    const size = this.articleSize();
    if (size !== 'xl' && size !== 'lg') {
      return variant;
    }

    return this.viewportWidth() < ROW_BREAKPOINT ? 'col' : 'row';
  });

  protected readonly isMobileMoreMenu = computed(() => this.viewportWidth() < ROW_BREAKPOINT);

  protected readonly disableActionTooltips = computed(
    () => this.isMobileMoreMenu() || this.isMoreMenuOpen(),
  );

  protected readonly showRowIdentityOnTop = computed(
    () => this.effectiveVariant() === 'row' && this.rowIdentityPosition() === 'top',
  );

  protected readonly showRowIdentityOnBottom = computed(
    () => this.effectiveVariant() === 'row' && this.rowIdentityPosition() === 'bottom',
  );

  protected readonly showReactions = computed(() => this.metricsType());

  protected readonly displayImage = computed(() => {
    if (this.imageBroken()) {
      return '';
    }

    return this.image() ?? '';
  });

  protected readonly watchLaterTooltip = computed(() =>
    this.isWatchLater() ? 'Elimină din Vizionează mai târziu' : 'Vizionează mai târziu',
  );

  protected readonly saveToListTooltip = computed(() =>
    this.isSavedToList() ? 'Elimină din listă' : 'Salvează în listă',
  );

  protected readonly hasRenderableImage = computed(() => Boolean(this.displayImage()));

  ngOnDestroy(): void {
    this.teardownOverlay();
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    const wasMobile = this.isMobileMoreMenu();
    this.viewportWidth.set(this.readViewportWidth());
    if (this.isMoreMenuOpen() && wasMobile !== this.isMobileMoreMenu()) {
      this.closeMoreMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.isMoreMenuOpen()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (this.activeMoreTrigger?.contains(target)) {
      return;
    }

    if (this.overlayRef?.overlayElement.contains(target)) {
      return;
    }

    this.closeMoreMenu();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMoreMenu();
  }

  protected onTitleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const link = this.link();
    const payload: string | number | null =
      this.openArticleId() ?? (link && link !== '#' ? link : null);

    this.openArticle.emit(payload);
  }

  protected onPublisherClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.publisherClick.emit();
  }

  protected onAuthorClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.authorClick.emit();
  }

  protected onImageError(): void {
    this.imageBroken.set(true);
  }

  protected onImageLoad(event: Event): void {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) {
      return;
    }

    if (
      img.naturalWidth < MIN_ACCEPTED_IMAGE_WIDTH ||
      img.naturalHeight < MIN_ACCEPTED_IMAGE_HEIGHT
    ) {
      this.imageBroken.set(true);
    }
  }

  protected toggleWatchLater(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.watchLater.emit();
  }

  protected toggleSaveToList(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.saveToList.emit();
  }

  protected toggleMoreMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    if (this.isMoreMenuOpen() && this.activeMoreTrigger === trigger) {
      this.closeMoreMenu();
      return;
    }

    this.closeMoreMenu();
    this.activeMoreTrigger = trigger;
    this.isMoreMenuOpen.set(true);

    if (this.isMobileMoreMenu()) {
      this.mobileMoreSheetMounted.set(true);
      requestAnimationFrame(() => {
        this.mobileMoreSheetActive.set(true);
        this.cdr.markForCheck();
      });
      return;
    }

    this.attachOverlay();
  }

  protected closeMoreMenu(): void {
    this.isMoreMenuOpen.set(false);
    this.mobileMoreSheetActive.set(false);
    this.mobileMoreSheetMounted.set(false);
    this.activeMoreTrigger = null;
    this.detachOverlay();
  }

  protected onMenuAction(
    action:
      | 'watchLater'
      | 'saveToList'
      | 'share'
      | 'copyLink'
      | 'report'
      | 'publisherFollow'
      | 'authorFollow',
  ): void {
    if (action === 'copyLink') {
      void this.copyShareUrl();
    }

    this[action].emit();
    this.closeMoreMenu();
  }

  private attachOverlay(): void {
    const tpl = this.moreMenuTpl;
    if (!tpl) {
      return;
    }

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        panelClass: this.paneClass,
        positionStrategy: floatingUiPositionStrategy(),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(new TemplatePortal(tpl, this.vcr));
    }

    this.startFloating();
  }

  private detachOverlay(): void {
    this.stopFloating();
    this.overlayRef?.detach();
  }

  private teardownOverlay(): void {
    this.stopFloating();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  private startFloating(): void {
    this.stopFloating();

    const reference = this.activeMoreTrigger;
    const floating = this.overlayRef?.overlayElement;
    if (!reference || !floating) {
      return;
    }

    this.floatingCleanup = autoUpdate(reference, floating, () => {
      void this.positionMenu(reference, floating);
    });
  }

  private stopFloating(): void {
    this.floatingCleanup?.();
    this.floatingCleanup = undefined;
  }

  private async positionMenu(reference: HTMLElement, floating: HTMLElement): Promise<void> {
    const { x, y } = await computePosition(reference, floating, {
      placement: 'bottom-end',
      strategy: 'fixed',
      middleware: [
        offset(MENU_OFFSET_PX),
        flip({ padding: MENU_VIEWPORT_PADDING_PX }),
        shift({ padding: MENU_VIEWPORT_PADDING_PX }),
      ],
    });

    Object.assign(floating.style, {
      position: 'fixed',
      left: `${Math.round(x)}px`,
      top: `${Math.round(y)}px`,
    });
  }

  private async copyShareUrl(): Promise<void> {
    const url = this.resolveShareUrl();
    try {
      await this.document.defaultView?.navigator.clipboard.writeText(url);
    } catch {
      /* host may not grant clipboard */
    }
  }

  private resolveShareUrl(): string {
    const link = this.link();
    if (link && link !== '#') {
      return link;
    }

    return this.document.defaultView?.location.href ?? '';
  }

  private readViewportWidth(): number {
    return this.document.defaultView?.innerWidth ?? 1280;
  }
}
