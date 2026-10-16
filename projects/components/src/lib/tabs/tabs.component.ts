import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LzInputFlush } from '../internal/lz-input-flush.directive';
import { CommonModule } from '@angular/common';
import { LzTabBadge, LzTabsSize, LzTabsStyle, LzDisabledTabTooltipTrigger } from './tabs.types';
import { Badge } from '../badge/badge.component';
import { Icon } from '../icon/icon.component';
import { Tooltip } from '../tooltip/tooltip.component';

/** Tabs — Laziar System (Figma Tabs): outline pill / underline / underline-text / border. */
@Component({
  selector: 'lz-tabs',
  standalone: true,
  hostDirectives: [LzInputFlush],
  imports: [CommonModule, Badge, Icon, Tooltip],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  host: {
    class: 'lz-tabs-host',
  },
})
export class Tabs {
  readonly tabs = input<string[]>([]);
  readonly style = input<LzTabsStyle>('outline');
  readonly size = input<LzTabsSize>('md');
  readonly badges = input<(LzTabBadge | null)[]>([]);
  readonly icons = input<string[]>([]);
  readonly class = input<string | undefined>(undefined);
  readonly disabledTabIndexes = input<number[]>([]);
  readonly disabledTabTooltips = input<Record<string, string>>({});
  readonly disabledTabTooltipTrigger = input<LzDisabledTabTooltipTrigger>('hover');
  /** Two-way active index (updates locally on click like F/P). */
  readonly activeTab = model(0);

  protected readonly showUnderline = computed(() => this.style() !== 'outline');

  /** Indicator sized to the active label's text, positioned from DOM measurements. */
  protected readonly isTextUnderline = computed(() => this.style() === 'underline-text');

  private readonly tablist = viewChild.required<ElementRef<HTMLElement>>('tablist');
  private readonly labels = viewChildren<ElementRef<HTMLElement>>('label');
  private readonly textUnderline = viewChild<ElementRef<HTMLElement>>('textUnderline');

  /** Bumped by ResizeObserver so the indicator follows layout / font changes. */
  private readonly layoutVersion = signal(0);
  private resizeObserver?: ResizeObserver;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.resizeObserver?.disconnect());

    afterRenderEffect({
      mixedReadWrite: () => {
        this.layoutVersion();
        const underline = this.textUnderline()?.nativeElement;
        const label = this.labels()[this.activeTab()]?.nativeElement;
        if (!underline || !label) {
          return;
        }

        this.observeLayout(label);

        const listRect = this.tablist().nativeElement.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        // First placement snaps into position; later changes slide.
        const placed = underline.dataset['placed'] === 'true';
        underline.style.transition = placed ? '' : 'none';
        underline.style.left = `${labelRect.left - listRect.left}px`;
        underline.style.width = `${labelRect.width}px`;
        underline.dataset['placed'] = 'true';
      },
    });
  }

  private observeLayout(label: HTMLElement): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.layoutVersion.update((v) => v + 1));
      this.resizeObserver.observe(this.tablist().nativeElement);
    }
    this.resizeObserver.observe(label);
  }

  protected readonly underlineStyle = computed(() => {
    const tabCount = this.tabs().length || 1;
    const width = 100 / tabCount;
    return {
      width: `${width}%`,
      left: `${this.activeTab() * width}%`,
    };
  });

  protected isTabDisabled(index: number): boolean {
    return this.disabledTabIndexes().includes(index);
  }

  protected getDisabledTooltip(index: number): string {
    return this.disabledTabTooltips()[String(index)] || '';
  }

  setActiveTab(index: number): void {
    if (this.isTabDisabled(index)) {
      return;
    }
    if (index >= 0 && index < this.tabs().length) {
      this.activeTab.set(index);
    }
  }
}
